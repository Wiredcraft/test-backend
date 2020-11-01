import _ from 'lodash'
import { BaseContext } from 'koa'
import jwt from 'jsonwebtoken'
import { getManager, Repository } from 'typeorm'
import { request, summary, description, responses, tagsAll, body } from 'koa-swagger-decorator'
import { User, userSchema } from '../entity/user'
import { config } from '../utils/config'
import { requiredProperties, isExpired } from '../utils/validate'
import { safeCall, response } from '../utils/helpers'

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
    public static async loginUser(context: BaseContext): Promise<void> {
        const missingProperties = requiredProperties(context.request.body, ['email', 'password'])

        if (missingProperties.length) return response(context, 400, `missing_fields: ${missingProperties.join(', ')}`)

        const userRepository: Repository<User> = getManager().getRepository(User)
        let user: User = new User()
        let call = await safeCall(userRepository.findOne({ where: { email: context.request.body.email } }))

        if(call.err) return response(context, 500, call.err)
        if(!call.res) return response(context, 400, 'user_not_found')

        user = call.res

        if (!(await user.checkIfUnencryptedPasswordIsValid(context.request.body.password))) 
        return response(context, 401, 'wrong_password')

        const refreshToken = jwt.sign({ email: user.email }, config.jwt.refreshTokenSecret, {
            expiresIn: config.jwt.refreshTokenLife,
        })

        call = await safeCall(userRepository.save(_.omit({ ...user, refreshToken }, ['createdAt'])))

        if(call.err) return response(context, 500, call.err)

        response(context, 200, {
            token: jwt.sign({ id: user.id, email: user.email }, config.jwt.accessTokenSecret, {
                expiresIn: config.jwt.accessTokenLife,
            }),
            message: 'login_success',
        })
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
    public static async refreshToken(context: BaseContext): Promise<void> {

        const userRepository: Repository<User> = getManager().getRepository(User)
        let user: User = new User()

        const token = context?.header?.authorization && context.header.authorization.split(' ')[1]
        let decoded: Record<string, any> | string

        try {
            decoded = jwt.verify(token, config.jwt.accessTokenSecret, { ignoreExpiration: true })
        } catch  {
            return response(context, 403, 'invalid_access_token')    
        }

        if (!_.isObject(decoded)) return response(context, 403, 'invalid_access_token')
        if (!decoded.hasOwnProperty('email')) return response(context, 403, 'invalid_access_token')

        // Send back the old jwt token in the response if still active
        if (!isExpired(decoded.exp)) 
            return response(context, 200, {
                token: jwt.sign(decoded, config.jwt.accessTokenSecret),
                message: 'valid_access_token',
            })
        
        const call = await safeCall(userRepository.findOne({ where: { email: decoded.email } }))
        if(call.err) return response(context, 500, call.err)
        if(!call.res) return response(context, 404, 'user_not_found')

        user = call.res

        // verify refresh token
        try {
            jwt.verify(user.refreshToken, config.jwt.refreshTokenSecret)
        } catch  {
            return response(context, 403, 'invalid_refresh_token')
        }

        response(context, 200, {
            token: jwt.sign({ id: user.id, email: user.email }, config.jwt.accessTokenSecret, {
                expiresIn: config.jwt.accessTokenLife,
            }),
            message: 'refresh_token_success',
        })
    }

    @request('get', '/logout')
    @summary('Log a user out')
    @responses({
        200: { description: 'user successfully logged out' },
        400: { description: 'missing fields' },
        401: { description: 'invalid access token, user not logged in' },
        404: { description: 'user not found' }
    })
    public static async logoutUser(context: BaseContext): Promise<void> {
        // possible solutions
        // 1. delete token on client side, delete refresh token on db, wait for access token to expire
        // 2. keep track of invalidated tokens on redis instance and cross-check on each auth request

        // solution 1
        const userRepository: Repository<User> = getManager().getRepository(User)
        let user: User = new User()

        let call = await safeCall(userRepository.findOneOrFail({ where: { email: context.state.user.email } }))
        if(call.err) return response(context, 500, call.err)
        if(!call.res) return response(context, 401, 'user_not_logged_in')
        
        user = call.res

        call = await safeCall(userRepository.save(_.omit({ ...user, refreshToken: 'removed' }, ['createdAt'])))
        if(call.err) return response(context, 500, call.err)

        response(context, 200, 'logout_success')
    }
}
