import _ from 'lodash'
import { BaseContext } from 'koa'
import { getManager, Repository} from 'typeorm'
import { request, summary, path, responses, tagsAll } from 'koa-swagger-decorator'
import { User, userSchema } from '../entity/user'
import { ObjectID } from 'mongodb'
import { validate} from '../utils/validate'
import { safeCall, response } from '../utils/helpers'

@tagsAll(['Follow'])
export default class FollowController {
    @request('patch', '/users/follow/{id}')
    @summary('Follow a user')
    @path({ id: { type: ObjectID, required: true, description: 'id of the user to follow' } })
    @responses({
        200: { description: 'user followed successfully' },
        400: { description: 'user not found, error following user' },
        401: { description: 'token authorization error' },
        403: { description: 'cant follow oneself' },
    })
    public static async followUser(context: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const userToFollowId = context.params.id
        let call = await safeCall(userRepository.findOne(context.state.user.id))

        if (call.err) return response(context, 500, call.err)

        const userToBeUpdated: User | undefined = call.res

        if (!userToBeUpdated) return response(context, 400, 'user_not_found')

        if (context.state.user.id === userToFollowId) return response(context, 400, 'cant_follow_oneself')

        if (userToBeUpdated.following.includes(userToFollowId)) return response(context, 200, userToBeUpdated.toJSON())

        if (!userToBeUpdated.following) userToBeUpdated.following = []

        userToBeUpdated.following.push(userToFollowId)

        call = await safeCall(userRepository.save(userToBeUpdated))

        if (call.err) return response(context, 500, call.err)

        response(context, 200, call.res.toJSON())
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
    public static async unfollowUser(context: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const userToFollowId = context.params.id
        let call = await safeCall(userRepository.findOne(context.state.user.id))

        if (call.err) return response(context, 500, call.err)

        const userToBeUpdated: User | undefined = call.res

        if (!userToBeUpdated) return response(context, 400, 'user_not_found')

        if (context.state.user.id === userToFollowId) return response(context, 400, 'cant_unfollow_oneself')

        if (!userToBeUpdated.following.includes(userToFollowId)) return response(context, 200, userToBeUpdated.toJSON())

        if (!userToBeUpdated.following) userToBeUpdated.following = []

        userToBeUpdated.following = userToBeUpdated.following.filter((id) => id !== userToFollowId)

        call = await safeCall(userRepository.save(userToBeUpdated))

        if (call.err) return response(context, 500, call.err)

        response(context, 200, call.res.toJSON())
    }

    @request('get', '/users/{id}/followers')
    @summary('Get all follwers of a user')
    @path({ id: { type: ObjectID, required: true, description: 'id of the user' } })
    @responses({
        200: { description: 'success' },
        400: { description: 'validation error, followers not found' },
        401: { description: 'token authorization error' },
    })
    public static async getFollowers(context: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const validationErrors = await validate({ id: context.params.id }, userSchema, ['id'])

        if (validationErrors) return response(context, 400, validationErrors)

        const call = await safeCall(userRepository.find({ following: context.params.id }))

        if (call.err) return response(context, 500, call.err)

        if (!call.res) return response(context, 400, 'followers_not_found')

        response(
            context,
            200,
            call.res.map((user: User) => user.toJSON()),
        )
    }

    @request('get', '/users/{id}/following')
    @summary('Get all people a user follows')
    @path({ id: { type: ObjectID, required: true, description: 'id of the user' } })
    @responses({
        200: { description: 'success' },
        400: { description: 'validation error, followed not found' },
        401: { description: 'token authorization error' },
    })
    public static async getFollowing(context: BaseContext): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const validationErrors = await validate({ id: context.params.id }, userSchema, ['id'])

        if (validationErrors) return response(context, 400, validationErrors)

        let call = await safeCall(userRepository.findOne(context.params.id))

        if (call.err) return response(context, 500, call.err)

        if (!call.res) return response(context, 400, 'following_not_found')

        call = await safeCall(
            userRepository.find({ where: { _id: { $in: call.res.following.map((id: string) => new ObjectID(id)) } } }),
        )

        if (call.err) return response(context, 500, call.err)

        response(
            context,
            200,
            call.res.map((user: User) => user.toJSON()),
        )
    }
}
