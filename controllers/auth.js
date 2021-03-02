'use strict'

const jwt = require('jsonwebtoken')
const config = require('../config')

async function login(ctx) {
  const { user, password } = ctx.request.body
  if (!(user === 'admin' && password === '123456')) {
    ctx.status = 401
    return
  }

  ctx.body = {
    access_token: jwt.sign({ uid: 'admin' }, config.jwtKey, { expiresIn: 7200 }),
    token_type: 'bearer',
    expires_in: 7200,
  }
}

module.exports = {
  login,
}
