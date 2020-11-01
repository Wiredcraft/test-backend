import _ from 'lodash'
import { BaseContext } from 'koa'
import { getManager, Repository, Not, Equal } from 'typeorm'
import { request, summary, path, body, responses, tagsAll, description } from 'koa-swagger-decorator'
import { User, userSchema } from '../entity/user'
import { validate, validatePassword, requiredProperties } from '../utils/validate'
import { safeCall, response } from '../utils/helpers'

@tagsAll(['User'])
export default class UserController {
    @request('get', '/users')
    @summary('Find all users')
    @responses({
        200: { description: 'success' },
        400: { description: 'error' },
        401: { description: 'token authorization error' },
    })
    public static async getUsers(context: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const call = await safeCall(userRepository.find())

        if (call.err) return response(context, 500, call.err)

        response(
            context,
            200,
            call.res.map((user: User) => user.toJSON()),
        )
    }

    @request('get', '/users/{id}')
    @summary('Find user by id')
    @path({
        id: { type: 'string', required: true, description: 'id of user' },
    })
    @responses({
        200: { description: 'success' },
        400: { description: 'validation error, user not found' },
        401: { description: 'token authorization error' },
    })
    public static async getUser(context: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const validationErrors = await validate({ id: context.params.id }, userSchema, ['id'])

        if (validationErrors) return response(context, 400, validationErrors)

        const call = await safeCall(userRepository.findOne(context.params.id))

        if (call.err) return response(context, 500, call.err)

        if (!call.res) return response(context, 400, 'user_not_found')

        response(context, 200, call.res.toJSON())
    }

    @request('post', '/users')
    @summary('Create a user')
    @description(
        `Note that the user password must have at least one uppercase character, one lowercase character, one number, one special symbol and be at least eight characters long. 
        name, email, passowrd, dob are required`,
    )
    @body(_.omit(userSchema.properties, ['id', 'createdAt', 'updatedAt', 'following']))
    @responses({
        201: { description: 'user created successfully' },
        400: { description: 'missing parameters, invalid password, validation errors' },
        401: { description: 'token authorization error' },
        409: { description: 'user already exists' },
    })
    public static async createUser(context: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const missingProperties = requiredProperties(context.request.body, ['name', 'email', 'password', 'dob'])

        if (missingProperties.length > 0)
            return response(context, 400, `missing_paramters: ${missingProperties.join(', ')}`)

        const passwordValidationResult = validatePassword(context.request.body.password)

        if (passwordValidationResult !== 'good')
            return response(context, 400, `bad_password: ${passwordValidationResult}`)

        const userToBeSaved: User = new User()

        userToBeSaved.name = context.request.body.name
        userToBeSaved.email = context.request.body.email
        userToBeSaved.password = context.request.body.password
        userToBeSaved.dob = context.request.body.dob
        userToBeSaved.following = []
        userToBeSaved.address = context.request.body.address || ''
        userToBeSaved.description = context.request.body.description || ''

        const validationErrors = await validate(userToBeSaved, userSchema, ['name', 'email', 'dob', 'password'])

        if (validationErrors) return response(context, 400, validationErrors)

        const call = await safeCall(userRepository.findOne({ email: userToBeSaved.email }))

        if (call.err) return response(context, 500, call.err)

        if (call.res) return response(context, 409, 'user_already_exists')

        // convert users dob to date object
        if (userToBeSaved.dob) userToBeSaved.dob = new Date(userToBeSaved.dob)

        try {
            await userToBeSaved.hashPassword()
            await userRepository.save(userToBeSaved)
        } catch {
            return response(context, 400, 'error_creating_user')
        }

        response(context, 201, 'user_created')
    }

    @request('patch', '/users/{id}')
    @summary('Update a user')
    @path({ id: { type: 'string', required: true, description: 'id of the user to update' }, data: { type: 'object', items: {} } })
    @body(_.omit(userSchema.properties, ['id', 'createdAt', 'updatedAt', 'following']))
    @responses({
        200: { description: 'user updated successfully' },
        400: { description: 'user not found, user already exists, validation errors, user already exists' },
        401: { description: 'token authorization error' },
        403: { description: 'not authorized to perform this action' },
    })
    public static async updateUser(context: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)

        const userToBeUpdated: User = new User()

        userToBeUpdated.id = context.params.id
        userToBeUpdated.name = context.request.body.name
        userToBeUpdated.email = context.request.body.email
        userToBeUpdated.dob = context.request.body.dob
        userToBeUpdated.address = context.request.body.address
        userToBeUpdated.description = context.request.body.description
        delete userToBeUpdated.createdAt

        const validationErrors = await validate(userToBeUpdated, userSchema, ['id'])

        if (validationErrors) return response(context, 400, validationErrors)

        let call = await safeCall(userRepository.findOne(userToBeUpdated.id))

        if (call.err) return response(context, 500, call.err)

        if (!call.res) return response(context, 400, 'user_not_found')

        call = await safeCall(
            userRepository.findOne({ id: Not(Equal(userToBeUpdated.id)), email: userToBeUpdated.email }),
        )

        if (call.err) return response(context, 500, call.err)

        if (call.res) return response(context, 400, 'user_already_exists')

        if (context.state.user.email !== userToBeUpdated.email) return response(context, 403, 'not_authorized')

        if (userToBeUpdated.dob) userToBeUpdated.dob = new Date(userToBeUpdated.dob)

        call = await safeCall(userRepository.save(userToBeUpdated))

        if (call.err) return response(context, 500, call.err)

        response(context, 200, call.res.toJSON())
    }

    @request('delete', '/users/{id}')
    @summary('Delete user by id')
    @path({ id: { type: 'string', required: true, description: 'id of user' } })
    @responses({
        204: { description: 'user deleted successfully' },
        400: { description: 'user not found, validation errors' },
        401: { description: 'token authorization error' },
        403: { description: 'not authorized to perform this action' },
    })
    public static async deleteUser(context: BaseContext): Promise<void> {
        const validationErrors = await validate({ id: context.params.id }, userSchema, ['id'])

        if (validationErrors) return response(context, 400, validationErrors)

        const userRepository = getManager().getRepository(User)
        const userToRemove: User | undefined = await userRepository.findOne(context.params.id)

        if (!userToRemove) return response(context, 400, 'user_not_found')

        if (context.state.user.email !== userToRemove.email) return response(context, 403, 'not_authorized')

        const call = await safeCall(userRepository.remove(userToRemove))

        if (call.err) return response(context, 500, call.err)

        response(context, 204)
    }

    @request('delete', '/testusers')
    @summary('Delete all test users')
    @responses({
        204: { description: 'all users deleted successfully' },
        401: { description: 'token authorization error' },
    })
    public static async deleteTestUsers(context: BaseContext): Promise<void> {
        const userRepository = getManager().getRepository(User)
        let call = await safeCall(userRepository.find({}))

        if (call.err) return response(context, 500, call.err)

        const usersToRemove: User[] = call.res

        call = await safeCall(userRepository.remove(usersToRemove))

        if (call.err) return response(context, 500, call.err)

        response(context, 204)
    }
}
