import _ from 'lodash'
import { BaseContext } from 'koa'
import { getManager, Repository, Not, Equal } from 'typeorm'
import { request, summary, path, body, responses, tagsAll, description } from 'koa-swagger-decorator'
import { User, userSchema } from '../entity/user'
import { ObjectID } from 'mongodb'
import { validate, validatePassword, requiredProperties } from '../utils/validate'
import { safeCall } from '../utils/helpers'

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
        const call = await safeCall(userRepository.find())

        if(call.err) {
            ctx.status = 400
            ctx.body = call.err
            return
        }

        ctx.status = 200
        ctx.body = call.res.map((user: User) => user.toJSON())
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

        const call = await safeCall(userRepository.findOne(ctx.params.id))

        if(call.err) {
            ctx.status = 400
            ctx.body = call.err
            return
        }

        if (!call.res) {
            ctx.status = 400
            ctx.body = 'user_not_found'
            return
        }

        ctx.status = 200
        ctx.body = call.res.toJSON()
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
    public static async createUser(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
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
        userToBeSaved.following = []
        userToBeSaved.address = ctx.request.body.address || ''
        userToBeSaved.description = ctx.request.body.description || ''

        const validationErrors = await validate(userToBeSaved, userSchema, ['name', 'email', 'dob', 'password'])

        if (validationErrors) {
            ctx.status = 400
            ctx.body = validationErrors
            return
        }

        const call = await safeCall(userRepository.findOne({ email: userToBeSaved.email }))

        if(call.err) {
            ctx.status = 400
            ctx.body = call.err
            return
        }

        if (call.res) {
            ctx.status = 409
            ctx.body = 'user_already_exists'
            return
        }

        // convert users dob to date object
        if (userToBeSaved.dob) userToBeSaved.dob = new Date(userToBeSaved.dob)

        try {
            await userToBeSaved.hashPassword()
            await userRepository.save(userToBeSaved)
        } catch(err) {
            ctx.status = 400
            ctx.body = 'error_creating_user'
            return
        }

        ctx.status = 201
        ctx.body = 'user_created'
    }

    @request('patch', '/users/{id}')
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

        const call = await safeCall(userRepository.findOne(userToBeUpdated.id))

        if(call.err) {
            ctx.status = 400
            ctx.body = call.err
            return
        }

        if (!call.res) {
            ctx.status = 400
            ctx.body = 'user_not_found'
            return
        }

        const secondCall = await safeCall(userRepository.findOne({ id: Not(Equal(userToBeUpdated.id)), email: userToBeUpdated.email }))

        if(secondCall.err) {
            ctx.status = 400
            ctx.body = secondCall.err
            return
        }

        if (secondCall.res) {
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

        const thirdCall = await safeCall(userRepository.save(userToBeUpdated))

        if(thirdCall.err) {
            ctx.status = 400
            ctx.body = thirdCall.err
            return
        }

        ctx.status = 200
        ctx.body = thirdCall.res.toJSON()
    }

    @request('patch', '/users/follow/{id}')
    @summary('Follow a user')
    @path({ id: { type: ObjectID, required: true, description: 'id of the user to follow' } })
    @responses({
        200: { description: 'user followed successfully' },
        400: { description: 'user not found, error following user' },
        401: { description: 'token authorization error' },
        403: { description: 'cant follow oneself' },
    })
    public static async followUser(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const userToFollowId = ctx.params.id
 
        const call = await safeCall(userRepository.findOne(ctx.state.user.id))

        if (call.err) {
            ctx.status = 400
            ctx.body = 'user_not_found'
            return
        }

        const userToBeUpdated: User | undefined = call.res
        
        if (!userToBeUpdated) {
            ctx.status = 400
            ctx.body = 'user_not_found'
            return
        }

        if (ctx.state.user.id === userToFollowId) {
            ctx.status = 400
            ctx.body = 'cant_follow_oneself'
            return
        }

        if (userToBeUpdated.following.includes(userToFollowId)) {
            ctx.status = 200
            ctx.body = userToBeUpdated.toJSON()
            return
        }

        if(!userToBeUpdated.following) userToBeUpdated.following = []
        userToBeUpdated.following.push(userToFollowId)

        const secondCall = await safeCall(userRepository.save(userToBeUpdated))

        if(secondCall.err) {
            ctx.status = 400
            ctx.body = 'error_following_user'
            return
        }

        ctx.status = 200
        ctx.body = secondCall.res.toJSON()
    }

    @request('patch', '/users/unfollow/{id}')
    @summary('Unfollow a user')
    @path({ id: { type: ObjectID, required: true, description: 'id of the user to follow' } })
    @responses({
        200: { description: 'user unfollowed successfully' },
        400: { description: 'user not found, error following user' },
        401: { description: 'token authorization error' },
        403: { description: 'cant unfollow oneself' },
    })
    public static async unfollowUser(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const userToFollowId = ctx.params.id
 
        const call = await safeCall(userRepository.findOne(ctx.state.user.id))

        if (call.err) {
            ctx.status = 400
            ctx.body = 'user_not_found'
            return
        }

        const userToBeUpdated: User | undefined = call.res
        
        if (!userToBeUpdated) {
            ctx.status = 400
            ctx.body = 'user_not_found'
            return
        }

        if (ctx.state.user.id === userToFollowId) {
            ctx.status = 400
            ctx.body = 'cant_unfollow_oneself'
            return
        }

        if (!userToBeUpdated.following.includes(userToFollowId)) {
            ctx.status = 200
            ctx.body = userToBeUpdated.toJSON()
            return
        }

        if(!userToBeUpdated.following) userToBeUpdated.following = []
        userToBeUpdated.following = userToBeUpdated.following.filter(id => id !== userToFollowId)

        const secondCall = await safeCall(userRepository.save(userToBeUpdated))

        if(secondCall.err) {
            ctx.status = 400
            ctx.body = 'error_unfollowing_user'
            return
        }

        ctx.status = 200
        ctx.body = secondCall.res.toJSON()
    }

    @request('get', '/users/{id}/followers')
    @summary('Get all follwers of a user')
    @path({ id: { type: ObjectID, required: true, description: 'id of the user' } })
    @responses({
        200: { description: 'success' },
        400: { description: 'validation error, followers not found' },
        401: { description: 'token authorization error' },
    })
    public static async getFollowers(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const validationErrors = await validate({ id: ctx.params.id }, userSchema, ['id'])

        if (validationErrors) {
            ctx.status = 400
            ctx.body = validationErrors
            return
        }

        const call = await safeCall(userRepository.find({ following: ctx.params.id }))

        if(call.err) {
            ctx.status = 400
            ctx.body = call.err
            return
        }

        if (!call.res) {
            ctx.status = 400
            ctx.body = 'followers_not_found'
            return
        }

        ctx.status = 200
        ctx.body = call.res.map((user: User) => user.toJSON())
    }

    @request('get', '/users/{id}/following')
    @summary('Get all people a user follows')
    @path({ id: { type: ObjectID, required: true, description: 'id of the user' } })
    @responses({
        200: { description: 'success' },
        400: { description: 'validation error, followed not found' },
        401: { description: 'token authorization error' },
    })
    public static async getFollowing(ctx: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const validationErrors = await validate({ id: ctx.params.id }, userSchema, ['id'])

        if (validationErrors) {
            ctx.status = 400
            ctx.body = validationErrors
            return
        }

        const call = await safeCall(userRepository.findOne(ctx.params.id))

        if(call.err) {
            ctx.status = 400
            ctx.body = call.err
            return
        }

        if (!call.res) {
            ctx.status = 400
            ctx.body = 'following_not_found'
            return
        }

        const secondCall = await safeCall(userRepository.find({ where: { _id: { $in: call.res.following.map((id: string) => new ObjectID(id)) }} }))

        if(secondCall.err) {
            ctx.status = 400
            ctx.body = secondCall.err
            return
        }

        ctx.status = 200
        ctx.body = secondCall.res.map((user: User) => user.toJSON())
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

        const call = await safeCall(userRepository.remove(userToRemove))

        if(call.err) {
            ctx.status = 400
            ctx.body = call.err
            return
        }

        ctx.status = 204
    }

    @request('delete', '/testusers')
    @summary('Delete all test users')
    @responses({
        204: { description: 'all users deleted successfully' },
        401: { description: 'token authorization error' },
    })
    public static async deleteTestUsers(ctx: BaseContext): Promise<void> {

        const userRepository = getManager().getRepository(User)
        const call = await safeCall(userRepository.find({}))

        if(call.err) {
            ctx.status = 400
            ctx.body = call.err
            return
        }

        const usersToRemove: User[] = call.res
        const secondCall = await safeCall(userRepository.remove(usersToRemove))

        if(secondCall.err) {
            ctx.status = 400
            ctx.body = secondCall.err
            return
        }

        ctx.status = 204
    }
}
