import _ from 'lodash'
import { BaseContext } from 'koa'
import jwt from 'jsonwebtoken'
import { getManager, Repository } from 'typeorm'
import { request, summary, description, responses, tagsAll, body } from 'koa-swagger-decorator'
import { User, userSchema } from '../entity/user'
import { config } from '../utils/config'
import { requiredProperties, isExpired } from '../utils/validate'
import { safeCall } from '../utils/helpers'

@tagsAll(['Auth'])
export default class AuthController {
    @request('post', '/login')
    @summary('Log a user in')
    @body(_.pick(userSchema.properties, ['email', 'password']))
    @responses({
        200: { description: 'successfully logged in' },
        400: { description: 'missing fields' },
        401: { description: 'unauthorized, missing/invalid jwt token, wrong password' },
        404: { description: 'user not found' }
    })
    public static async loginUser(ctx: BaseContext): Promise<void> {

        const missingProperties = requiredProperties(ctx.request.body, ['email', 'password'])

        if (missingProperties.length) {
            ctx.status = 400
            ctx.body = `missing_fields: ${missingProperties.join(', ')}`
            return
        }

        const userRepository: Repository<User> = getManager().getRepository(User)
        let user: User = new User()

        try {
            user = await userRepository.findOneOrFail({ where: { email: ctx.request.body.email } })
        } catch (error) {
            ctx.status = 404
            ctx.body = 'user_not_found'
            return
        }

        if (!(await user.checkIfUnencryptedPasswordIsValid(ctx.request.body.password))) {
            ctx.status = 401
            ctx.body = 'wrong_password'
            return
        }

        const refreshToken = jwt.sign({ email: user.email }, config.jwt.refreshTokenSecret, {
            expiresIn: config.jwt.refreshTokenLife,
        })

        const { err } = await safeCall(userRepository.save(_.omit({ ...user, refreshToken }, ['createdAt'])))

        if(err) {
            ctx.status = 400
            ctx.body = err
            return
        }

        ctx.status = 200
        ctx.body = {
            token: jwt.sign({ id: user.id, email: user.email }, config.jwt.accessTokenSecret, {
                expiresIn: config.jwt.accessTokenLife,
            }),
            message: 'login_success',
        }
    }

    @request('get', '/refresh')
    @summary('Get the refresh token')
    @description('The user must already be authorized to used this route to get the refresh token')
    @responses({
        200: { description: 'still valid access token, successfully refreshed token' },
        400: { description: 'missing fields' },
        403: { description: 'unauthorized, missing/invalid jwt token' },
        404: { description: 'user not found' }
    })
    public static async refreshToken(ctx: BaseContext): Promise<void> {

        const userRepository: Repository<User> = getManager().getRepository(User)
        let user: User = new User()

        const token = ctx?.header?.authorization && ctx.header.authorization.split(' ')[1]
        let decoded: Record<string, any> | string

        try {
            decoded = jwt.verify(token, config.jwt.accessTokenSecret, { ignoreExpiration: true })
        } catch (err) {
            ctx.status = 403
            ctx.body = 'invalid_access_token'
            return
        }

        if (!_.isObject(decoded)) {
            ctx.status = 403
            ctx.body = 'invalid_access_token'
            return
        }

        if (!decoded.hasOwnProperty('email')) {
            ctx.status = 403
            ctx.body = 'invalid_access_token'
            return
        }

        // Send back the old jwt token in the response if still active
        if (!isExpired(decoded.exp)) {
            ctx.status = 200
            ctx.body = {
                token: jwt.sign(decoded, config.jwt.accessTokenSecret),
                message: 'valid_access_token',
            }
            return
        }
        
        try {
            user = await userRepository.findOneOrFail({ where: { email: decoded.email } })
        } catch (error) {
            ctx.status = 404
            ctx.body = 'user_not_found'
            return
        }

        // verify refresh token
        try {
            jwt.verify(user.refreshToken, config.jwt.refreshTokenSecret)
        } catch (err) {
            ctx.status = 403
            ctx.body = 'invalid_refresh_token'
            return
        }

        ctx.status = 200
        ctx.body = {
            token: jwt.sign({ id: user.id, email: user.email }, config.jwt.accessTokenSecret, {
                expiresIn: config.jwt.accessTokenLife,
            }),
            message: 'refresh_token_success',
        }
    }

    @request('get', '/logout')
    @summary('Log a user out')
    @responses({
        200: { description: 'user successfully logged out' },
        400: { description: 'missing fields' },
        401: { description: 'invalid access token, user not logged in' },
        404: { description: 'user not found' }
    })
    public static async logoutUser(ctx: BaseContext): Promise<void> {
        // possible solutions
        // 1. delete token on client side, delete refresh token on db, wait for access token to expire
        // 2. keep track of invalidated tokens on redis instance and cross-check on each auth request

        // solution 1
        const userRepository: Repository<User> = getManager().getRepository(User)
        let user: User = new User()

        try {
            user = await userRepository.findOneOrFail({ where: { email: ctx.state.user.email } })
        } catch (error) {
            ctx.status = 401
            ctx.body = 'user_not_logged_in'
            return
        }

        await userRepository.save(_.omit({ ...user, refreshToken: 'removed' }, ['createdAt']))

        ctx.status = 200
        ctx.body = 'logout_success'
    }
}
