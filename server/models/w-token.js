import assert from 'assert'
import uuidV1 from 'uuid/v1'
import * as ERRORS from '../lib/error'

module.exports = WToken => {
  WToken.observe('before save', (ctx, next) => {
    if (!ctx.instance || ctx.instance.id) {
      return next()
    }

    ctx.instance.id = uuidV1()
    next()
  })

  WToken.findForRequest = function (req, cb) {
    const id = tokenIdForRequest(req)

    if (id) {
      this.findById(id, (err, token) => {
        if (err) return cb(err)

        if (token) {
          token.validate((err, isValid) => {
            if (err) return cb(err)

            if (isValid) return cb(null, token)

            return cb(ERRORS.TOKEN_INVALID)
          })
        } else {
          return cb()
        }
      })
    } else {
      process.nextTick(() => {
        cb()
      })
    }
  }

  // Original method fron AccessToken
  WToken.prototype.validate = function (cb) {
    try {
      assert(
          this.created_at && typeof this.created_at.getTime === 'function',
        'token.created must be a valid Date'
      )
      assert(this.ttl !== 0, 'token.ttl must be not be 0')
      assert(this.ttl, 'token.ttl must exist')
      assert(this.ttl >= -1, 'token.ttl must be >= -1')

      var AccessToken = this.constructor
      var userRelation = AccessToken.relations.user // may not be set up
      var User = userRelation && userRelation.modelTo

      // redefine user model if accessToken's principalType is available
      if (this.principalType) {
        User = AccessToken.registry.findModel(this.principalType)
        if (!User) {
          process.nextTick(function () {
            return cb(null, false)
          })
        }
      }

      var now = Date.now()
      var createdAt = this.created_at.getTime()
      var elapsedSeconds = (now - createdAt) / 1000
      var secondsToLive = this.ttl
      var eternalTokensAllowed = !!(User && User.settings.allowEternalTokens)
      var isEternalToken = secondsToLive === -1
      var isValid = isEternalToken
        ? eternalTokensAllowed
        : elapsedSeconds < secondsToLive

      if (isValid) {
        process.nextTick(function () {
          cb(null, isValid)
        })
      } else {
        this.destroy(function (err) {
          cb(err, isValid)
        })
      }
    } catch (e) {
      process.nextTick(function () {
        cb(e)
      })
    }
  }

  // Original method fron AccessToken
  const tokenIdForRequest = (req, options = {}) => {
    var params = options.params || []
    var headers = options.headers || []
    var cookies = options.cookies || []
    var i = 0
    var length, id

    // https://github.com/strongloop/loopback/issues/1326
    if (options.searchDefaultTokenKeys !== false) {
      params = params.concat(['access_token'])
      headers = headers.concat(['X-Access-Token', 'authorization'])
      cookies = cookies.concat(['access_token', 'authorization'])
    }

    for (length = params.length; i < length; i++) {
      var param = params[i]
      // replacement for deprecated req.param()
      id = req.params && req.params[param] !== undefined ? req.params[param]
        : req.body && req.body[param] !== undefined ? req.body[param]
        : req.query && req.query[param] !== undefined ? req.query[param]
        : undefined

      if (typeof id === 'string') {
        return id
      }
    }

    for (i = 0, length = headers.length; i < length; i++) {
      id = req.header(headers[i])

      if (typeof id === 'string') {
        // Add support for oAuth 2.0 bearer token
        // http://tools.ietf.org/html/rfc6750
        if (id.indexOf('Bearer ') === 0) {
          id = id.substring(7)
          // Decode from base64
          var buf = new Buffer(id, 'base64')
          id = buf.toString('utf8')
        } else if (/^Basic /i.test(id)) {
          id = id.substring(6)
          id = (new Buffer(id, 'base64')).toString('utf8')
          // The spec says the string is user:pass, so if we see both parts
          // we will assume the longer of the two is the token, so we will
          // extract "a2b2c3" from:
          //   "a2b2c3"
          //   "a2b2c3:"   (curl http://a2b2c3@localhost:3000/)
          //   "token:a2b2c3" (curl http://token:a2b2c3@localhost:3000/)
          //   ":a2b2c3"
          var parts = /^([^:]*):(.*)$/.exec(id)
          if (parts) {
            id = parts[2].length > parts[1].length ? parts[2] : parts[1]
          }
        }
        return id
      }
    }

    if (req.signedCookies) {
      for (i = 0, length = cookies.length; i < length; i++) {
        id = req.signedCookies[cookies[i]]

        if (typeof id === 'string') {
          return id
        }
      }
    }
    return null
  }
}
