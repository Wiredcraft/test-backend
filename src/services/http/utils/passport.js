'use strict'
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { jwt } = require('../../../config/vars')
const { fetchAdmin } = require('../../storage/handler')

/**
 * Options for handling JWT requests
 */
let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwt.jwtSecret
}

/**
 * Jwt Strategy for passport
 */
let strategy = new JwtStrategy(opts, async (payload, next) => {
  let admin = await fetchAdmin(payload.username)
  if (admin) {
    delete admin.password
    next(null, admin)
  } else {
    next(null, null)
  }
})

passport.use(strategy)

passport.serializeUser((user, cb) => {
  cb(null, user)
})
passport.deserializeUser((id, cb) => {
  cb(null, id)
})

module.exports = passport
