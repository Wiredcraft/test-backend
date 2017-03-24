import { app } from '../server'
import crypto from 'crypto'
import * as ERRORS from '../lib/error'

module.exports = WUser => {
  WUser.disableRemoteMethodByName('find') // Disable GET /users
  WUser.disableRemoteMethodByName('patchOrCreate') // Disable PATCH /users
  WUser.disableRemoteMethodByName('replaceOrCreate') // Disable PUT /users
  WUser.disableRemoteMethodByName('prototype.updateAttributes') // Disable PATCH /users/{id}
  WUser.disableRemoteMethodByName('exists') // Disable HEAD /users/{id}
  // Will Disable PUT /users/{id} at same time
  // WUser.disableRemoteMethodByName('replaceById') // Disable POST /users/{id}/replace
  WUser.disableRemoteMethodByName('createChangeStream') // Disable GET&POST /users/{id}/change-stream
  WUser.disableRemoteMethodByName('count') // Disable GET /users/count
  WUser.disableRemoteMethodByName('findOne') // Disable GET /users/findOne
  WUser.disableRemoteMethodByName('updateAll') // Disable POST /users/update
  WUser.disableRemoteMethodByName('upsertWithWhere') // Disable POST /users/upsertWithWhere

  const makeSalt = () => Math.round((new Date().valueOf() * Math.random())) + ''
  const encryptPassword = (password, salt) =>
    crypto.createHmac('sha1', salt)
      .update(password)
      .digest('hex')

  WUser.prototype.hasPassword = function (plain) {
    if (this.password && plain) {
      return encryptPassword(plain, this.salt) === this.password
    }
  }

  WUser.prototype.createToken = function (ttl, cb) {
    if (typeof ttl === 'function') {
      cb = ttl
      ttl = undefined
    }
    const { WToken } = app.models

    WToken.create({
      ttl: ttl,
      userId: this.id
    }, (err, instance) => {
      cb(err, instance)
    })
  }

  WUser.observe('before save', (ctx, next) => {
    const { WUser } = app.models
    if (ctx.instance && ctx.instance.user_name && ctx.instance.name) {
      if (ctx.isNewInstance) {
        // Create new user
        WUser.findOne({
          where: {
            user_name: ctx.instance.user_name
          }
        }, (err, instance) => {
          if (err) return next(ERRORS.MONGO_ERROR(err))

          if (instance) {
            // Duplicated user name
            next(ERRORS.USER_NAME_BEEN_TAKEN)
          } else {
            // Setup new user
            if (!ctx.instance.password) {
              return next(ERRORS.INVALID_ERROR(new Error('Password is required')))
            }
            const salt = makeSalt()
            ctx.instance.salt = salt
            ctx.instance.password = encryptPassword(ctx.instance.password, salt)
            next()
          }
        })
      } else {
        // Update User info
        if (ctx.options && ctx.options.accessToken) {
          WUser.findById(ctx.instance.id, (err, instance) => {
            if (err) return next(ERRORS.MONGO_ERROR(err))

            if (String(ctx.options.accessToken.userId) === String(ctx.instance.id)) {
              ctx.instance.user_name = instance.user_name
              ctx.instance.salt = instance.salt
              ctx.instance.password = ctx.instance.password
                ? encryptPassword(ctx.instance.password, instance.salt)
                : instance.password
              next()
            } else {
              // User not allow to update other user info.
              next(ERRORS.USER_PREVENTED)
            }
          })
        } else {
          // User not authorized and not allow to edit user info
          next(ERRORS.USER_UNAUTHORIZED)
        }
      }
    } else {
      // Required userName and Name
      next(ERRORS.INVALID_ERROR(new Error('UserName and Name are required')))
    }
  })

  WUser.login = (credentials, cb) => {
    if (credentials.user_name && credentials.password) {
      const { WUser } = app.models
      WUser.findOne({
        where: {
          user_name: credentials.user_name
        }
      }, (err, instance) => {
        if (err) return cb(ERRORS.MONGO_ERROR(err))

        if (instance) {
          if (instance.hasPassword(credentials.password)) {
            instance.createToken(cb)
          } else {
            // Password not match user
            cb(ERRORS.USER_CREDENTIALS_INVALID)
          }
        } else {
          // No specific user
          cb(ERRORS.USER_NOT_FOUND)
        }
      })
    } else {
      // Missing user_name or password
      cb(ERRORS.USER_CREDENTIALS_MISSING)
    }
  }

  WUser.logout = (token, cb) => {
    if (!token) return cb(ERRORS.TOKEN_NOT_EXIST_TO_LOGOUT)

    const { WToken } = app.models
    WToken.destroyById(token, (err, info) => {
      if (err) return cb(ERRORS.MONGO_ERROR(err))

      if (info.count && info.count === 0) {
        return cb(ERRORS.TOKEN_NOT_FOUND)
      } else {
        return cb()
      }
    })
  }

  WUser.remoteMethod('login', {
    description: 'Lgoin a user with username and password',
    accepts: [
      { arg: 'credentials',
        type: 'object',
        required: true,
        description: 'Type in the required username and password to login.',
        http: {source: 'body'} }
    ],
    returns: {
      arg: 'accessToken', type: 'object', root: true
    },
    http: {verb: 'post'}
  })

  WUser.remoteMethod('logout', {
    description: 'Logout a user with access token.',
    accepts: [
      { arg: 'access_token',
        type: 'string',
        http: (ctx) => {
          var req = ctx && ctx.req
          var accessToken = req && req.accessToken
          var tokenID = accessToken ? accessToken.id : undefined

          return tokenID
        },
        description: 'Do not supply this argument, it is automatically extracted ' +
        'from request headers.'
      }
    ],
    http: {verb: 'all'}
  })
}
