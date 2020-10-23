import _ from 'lodash'
import { BaseContext } from 'koa'
import { getManager, Repository, Not, Equal } from 'typeorm'
import { validate, ValidationError } from 'class-validator'
import { request, summary, path, body, responsesAll, tagsAll } from 'koa-swagger-decorator'
import { User, userSchema } from '../entity/user'
import { ObjectID } from 'mongodb'
import { isValidMongoId } from '../utils/helpers'

@responsesAll({
    200: { description: 'success' },
    400: { description: 'bad request' },
    401: { description: 'unauthorized, missing/wrong jwt token' },
})
@tagsAll(['User'])
export default class UserController {
    @request('get', '/users')
    @summary('Find all users')
    public static async getUsers(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const users: User[] = await userRepository.find()

        ctx.status = 200
        ctx.body = users
    }

    @request('get', '/users/{id}')
    @summary('Find user by id')
    @path({
        id: { type: ObjectID, required: true, description: 'id of user' },
    })
    public static async getUser(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        
        if(!isValidMongoId(ctx.params.id)) {
            ctx.status = 400
            ctx.body = 'The user you are trying to retrieve doesn\'t exist in the db (invalid userID)'
            return
        }
        
        const user: User | undefined = await userRepository.findOne(ctx.params.id)

        if (user) {
            ctx.status = 200
            ctx.body = user
        } else {
            ctx.status = 400
            ctx.body = 'The user you are trying to retrieve doesn\'t exist in the db'
        }
    }

    @request('post', '/users')
    @summary('Create a user')
    @body(_.omit(userSchema, ['id']))
    public static async createUser(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)

        // build up entity user to be saved
        const userToBeSaved: User = new User()
        userToBeSaved.name = ctx.request.body.name
        userToBeSaved.email = ctx.request.body.email
        userToBeSaved.dob = new Date(ctx.request.body.dob)
        userToBeSaved.address = ctx.request.body.address || ''
        userToBeSaved.description = ctx.request.body.description || ''

        // validate user entity
        const errors: ValidationError[] = await validate(userToBeSaved) // errors is an array of validation errors

        if (errors.length > 0) {
            ctx.status = 400
            ctx.body = errors
        } else if (await userRepository.findOne({ email: userToBeSaved.email })) {
            ctx.status = 400
            ctx.body = 'The specified e-mail address already exists'
        } else {
            const user = await userRepository.save(userToBeSaved)

            ctx.status = 201
            ctx.body = user
        }
    }

    @request('put', '/users/{id}')
    @summary('Update a user')
    @path({ id: { type: ObjectID, required: true, description: 'id of user' } })
    @body(_.omit(userSchema, ['id']))
    public static async updateUser(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)

        // update the user by specified id
        // build up entity user to be updated
        const userToBeUpdated: User = new User()
        userToBeUpdated.id = ctx.params.id
        userToBeUpdated.name = ctx.request.body.name
        userToBeUpdated.email = ctx.request.body.email
        userToBeUpdated.dob = ctx.request.body.dob
        userToBeUpdated.address = ctx.request.body.address
        userToBeUpdated.description = ctx.request.body.description

        // validate user entity
        const errors: ValidationError[] = await validate(userToBeUpdated, { skipMissingProperties: true }) // errors is an array of validation errors

        if(!isValidMongoId(ctx.params.id)) {
            ctx.status = 400
            ctx.body = 'The user you are trying to update doesn\'t exist in the db (invalid userID)'
            return
        }

        if (errors.length > 0) {
            ctx.status = 400
            ctx.body = errors
        } else if (!(await userRepository.findOne(userToBeUpdated.id))) {
            ctx.status = 400
            ctx.body = 'The user you are trying to update doesn\'t exist in the db'
        } else if (await userRepository.findOne({ id: Not(Equal(userToBeUpdated.id)), email: userToBeUpdated.email })) {
            ctx.status = 400
            ctx.body = 'The specified e-mail address already exists'
        } else if (ctx.state.user.email !== userToBeUpdated.email) {
            ctx.status = 403
            ctx.body = 'A user can only be updated by the user themselves'
        }else {
            const user = await userRepository.save(userToBeUpdated)

            ctx.status = 201
            ctx.body = user
        }
    }

    @request('delete', '/users/{id}')
    @summary('Delete user by id')
    @path({ id: { type: ObjectID, required: true, description: 'id of user' } })
    public static async deleteUser(ctx: BaseContext): Promise<void> {

        if(!isValidMongoId(ctx.params.id)) {
            ctx.status = 400
            ctx.body = 'The user you are trying to delete doesn\'t exist in the db (invalid userID)'
            return
        }

        const userRepository = getManager().getRepository(User)
        const userToRemove: User | undefined = await userRepository.findOne(ctx.params.id)

        if (!userToRemove) {
            ctx.status = 400
            ctx.body = 'The user you are trying to delete doesn\'t exist in the db'
        } else if (ctx.state.user.email !== userToRemove.email) {
            ctx.status = 403
            ctx.body = 'A user can only be deleted by the user themselves'
        } else {
            await userRepository.remove(userToRemove)

            // return a NO CONTENT status code
            ctx.status = 204
        }
    }

}
