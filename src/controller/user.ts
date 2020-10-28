import _ from 'lodash'
import { BaseContext } from 'koa'
import { getManager, Repository, Not, Equal } from 'typeorm'
import { request, summary, path, body, responses, tagsAll, description } from 'koa-swagger-decorator'
import { User, userSchema } from '../entity/user'
import { ObjectID } from 'mongodb'
import { validate, validatePassword, requiredProperties } from '../utils/validate'

@tagsAll(['User'])
export default class UserController {
    @request('get', '/users')
    @summary('Find all users')
    @responses({
        200: { description: 'success' },
        400: { description: 'error' },
        401: { description: 'token authorization error' },
    })
    public static async getUsers(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const users: User[] = await userRepository.find()

        ctx.status = 200
        ctx.body = users.map((user) => user.toJSON())
    }

    @request('get', '/users/{id}')
    @summary('Find user by id')
    @path({
        id: { type: ObjectID, required: true, description: 'id of user' },
    })
    @responses({
        200: { description: 'success' },
        400: { description: 'validation error, user not found' },
        401: { description: 'token authorization error' },
    })
    public static async getUser(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)

        const validationErrors = await validate({ id: ctx.params.id }, userSchema, ['id'])

        if (validationErrors) {
            ctx.status = 400
            ctx.body = validationErrors
            return
        }

        const user: User | undefined = await userRepository.findOne(ctx.params.id)

        if (user) {
            ctx.status = 200
            ctx.body = user.toJSON()
            return
        }

        ctx.status = 400
        ctx.body = 'user_not_found'
    }

    @request('post', '/users')
    @summary('Create a user')
    @description(
        `Note that the user password must have at least one uppercase character, one lowercase character, one number, one special symbol and be at least eight characters long. 
        name, email, passowrd, dob are required`,
    )
    @body(_.omit(userSchema.properties, ['id', 'createdAt', 'updatedAt']))
    @responses({
        201: { description: 'user created successfully' },
        400: { description: 'missing parameters, invalid password, validation errors, user already exists' },
        401: { description: 'token authorization error' },
    })
    public static async createUser(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)

        // validate properties required to create a new user
        const missingProperties = requiredProperties(ctx.request.body, ['name', 'email', 'password', 'dob'])

        if (missingProperties.length) {
            ctx.status = 400
            ctx.body = `missing_paramters: ${missingProperties.join(', ')}`
            return
        }

        const passwordValidationResult = validatePassword(ctx.request.body.password)

        if (passwordValidationResult !== 'good') {
            ctx.status = 400
            ctx.body = `bad_password: ${passwordValidationResult}`
            return
        }

        const userToBeSaved: User = new User()
        userToBeSaved.name = ctx.request.body.name
        userToBeSaved.email = ctx.request.body.email
        userToBeSaved.password = ctx.request.body.password
        userToBeSaved.dob = ctx.request.body.dob
        userToBeSaved.address = ctx.request.body.address || ''
        userToBeSaved.description = ctx.request.body.description || ''

        const validationErrors = await validate(userToBeSaved, userSchema, ['name', 'email', 'dob', 'password'])

        if (validationErrors) {
            ctx.status = 400
            ctx.body = validationErrors
            return
        }

        if (await userRepository.findOne({ email: userToBeSaved.email })) {
            ctx.status = 400
            ctx.body = 'user_already_exists'
            return
        }

        // convert users dob to date object
        if (userToBeSaved.dob) userToBeSaved.dob = new Date(userToBeSaved.dob)

        await userToBeSaved.hashPassword()

        const user = await userRepository.save(userToBeSaved)

        ctx.status = 201
        ctx.body = user.toJSON()
    }

    @request('put', '/users/{id}')
    @summary('Update a user')
    @path({ id: { type: ObjectID, required: true, description: 'id of the user to update' } })
    @body(_.omit(userSchema.properties, ['id', 'createdAt', 'updatedAt']))
    @responses({
        200: { description: 'user updated successfully' },
        400: { description: 'user not found, user already exists, validation errors, user already exists' },
        401: { description: 'token authorization error' },
        403: { description: 'not authorized to perform this action' },
    })
    public static async updateUser(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)

        const userToBeUpdated: User = new User()
        userToBeUpdated.id = ctx.params.id
        userToBeUpdated.name = ctx.request.body.name
        userToBeUpdated.email = ctx.request.body.email
        userToBeUpdated.dob = ctx.request.body.dob
        userToBeUpdated.address = ctx.request.body.address
        userToBeUpdated.description = ctx.request.body.description
        delete userToBeUpdated.createdAt

        const validationErrors = await validate(userToBeUpdated, userSchema, ['id'])

        if (validationErrors) {
            ctx.status = 400
            ctx.body = validationErrors
            return
        }

        if (!(await userRepository.findOne(userToBeUpdated.id))) {
            ctx.status = 400
            ctx.body = 'user_not_found'
            return
        }

        if (await userRepository.findOne({ id: Not(Equal(userToBeUpdated.id)), email: userToBeUpdated.email })) {
            ctx.status = 400
            ctx.body = 'user_already_exists'
            return
        }

        if (ctx.state.user.email !== userToBeUpdated.email) {
            ctx.status = 403
            ctx.body = 'not_authorized'
            return
        }

        if (userToBeUpdated.dob) userToBeUpdated.dob = new Date(userToBeUpdated.dob)

        const user = await userRepository.save(userToBeUpdated)

        ctx.status = 200
        ctx.body = user.toJSON()
    }

    @request('delete', '/users/{id}')
    @summary('Delete user by id')
    @path({ id: { type: ObjectID, required: true, description: 'id of user' } })
    @responses({
        204: { description: 'user deleted successfully' },
        400: { description: 'user not found, validation errors' },
        401: { description: 'token authorization error' },
        403: { description: 'not authorized to perform this action' },
    })
    public static async deleteUser(ctx: BaseContext): Promise<void> {
        const validationErrors = await validate({ id: ctx.params.id }, userSchema, ['id'])

        if (validationErrors) {
            ctx.status = 400
            ctx.body = validationErrors
            return
        }

        const userRepository = getManager().getRepository(User)
        const userToRemove: User | undefined = await userRepository.findOne(ctx.params.id)

        if (!userToRemove) {
            ctx.status = 400
            ctx.body = 'user_not_found'
            return
        }

        if (ctx.state.user.email !== userToRemove.email) {
            ctx.status = 403
            ctx.body = 'not_authorized'
            return
        }

        await userRepository.remove(userToRemove)

        ctx.status = 204 // NO CONTENT status code
    }

    @request('delete', '/testusers')
    @summary('Delete all test users')
    @responses({
        204: { description: 'all users deleted successfully' },
        401: { description: 'token authorization error' },
    })
    public static async deleteTestUsers(ctx: BaseContext): Promise<void> {
        // get a user repository to perform operations with user
        const userRepository = getManager().getRepository(User)

        // find test users
        const usersToRemove: User[] = await userRepository.find({})

        // the user is there so can be removed
        await userRepository.remove(usersToRemove)

        // return a NO CONTENT status code
        ctx.status = 204
    }
}
