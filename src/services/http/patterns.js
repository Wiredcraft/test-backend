'use strict'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { crypt } = require('../../config/vars')
const { responseHandler, errorHandler } = require('../../services/http/utils/response')

/**
 * Plugin handles the user entity data store
 */
module.exports = function plugin (options) {
  var seneca = this

  /**
     * Handles creating a new administrator
     */
  seneca.add('role:auth,cmd:signup', (msg, done) => {
    let args = msg.args.body
    try {
      bcrypt.genSalt(crypt.SALT_WORK_FACTOR, function (err, salt) {
        bcrypt.hash(args.password, salt, function (err, hash) {
          seneca.act('role:storage,cmd:insert', ({ type: 'administrator', input: { username: args.username, password: hash } }), function (err, res) {
            console.log(res)
            delete res.password
            done(err, responseHandler(res))
          })
        })
      })
    } catch (err) {
      done(err, responseHandler(err))
    }
  })

  /**
     * this action handles signing payload and returns a valid token for authentication
     */
  seneca.add('role:auth,cmd:login', (msg, done) => {
    let args = msg.args.body
    let message
    seneca.act('role:storage,cmd:fetchAdmin', ({ username: args.username }), function (err, admin) {
      message = {
        error: 'invalid credentials'
      }
      if (admin) {
        bcrypt.compare(args.password, admin.password, function (err, res) {
          if (res === true) {
            let payload = { id: admin._id, username: admin.username }
            let token = jwt.sign(payload, options.secretOrKey)
            message = {
              token: token
            }
            done(err, responseHandler(message))
          } else {
            done(err, responseHandler(message))
          }
        })
      } else {
        done(err, responseHandler(message))
      }
    })
  })

  /**
     * handles returning a user entity
     */
  seneca.add('role:user,cmd:load', async (msg, done) => {
    let args = msg.args.params
    seneca.act('role:validator,cmd:get', { id: args.id }, (err, result) => {
      if (result.valid === true) {
        seneca.act('role:storage,cmd:fetch', { type: 'user', id: args.id }, (err, res) => {
          done(err, responseHandler(res))
        })
      } else {
        done(err, errorHandler({ message: 'validation failed' }))
      }
    })
  })

  /**
     * handles creating user entity
     */
  seneca.add('role:user,cmd:create', (msg, done) => {
    let body = msg.args.body
    seneca.act('role:validator,cmd:create', { user: body }, (err, result) => {
      if (result.valid === true) {
        seneca.act('role:storage,cmd:insert', { type: 'user', input: result.object }, function (err, res) {
          done(err, responseHandler(res))
        })
      } else {
        done(err, errorHandler({ message: 'validation failed' }))
      }
    })
  })

  /**
     * handles updating user entity
     */
  seneca.add('role:user,cmd:edit', (msg, done) => {
    let body = msg.args.body
    let params = msg.args.params
    seneca.act('role:validator,cmd:update', { user: body }, (err, result) => {
      if (result.valid === true) {
        seneca.act('role:storage,cmd:update', { type: 'user', input: result.object, id: params.id }, function (err, res) {
          done(err, responseHandler(res))
        })
      } else {
        done(err, errorHandler({ message: 'validation failed' }))
      }
    })
  })

  /**
     * handles deleting a user entity
     */
  seneca.add('role:user,cmd:delete', async (msg, done) => {
    let args = msg.args.params
    seneca.act('role:validator,cmd:del', { id: args.id }, (err, result) => {
      if (result.valid === true) {
        seneca.act('role:storage,cmd:deleteOne', { type: 'user', id: args.id }, (err, res) => {
          done(err, responseHandler(res))
        })
      } else {
        done(err, errorHandler({ message: 'validation failed' }))
      }
    })
  })
}
