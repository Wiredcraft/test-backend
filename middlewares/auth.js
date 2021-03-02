'use strict'

const jwt = require('jsonwebtoken')
const config = require('../config')

async function auth(ctx, next) {
  const authorization = ctx.headers['authorization']
  if (!authorization || !authorization.startsWith('Bearer ')) {
    ctx.status = 401
    return
  }

  const token = authorization.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, config.jwtKey)
    ctx.state.uid = payload.uid
  } catch (err) {
    ctx.status = 401
    return
  }

  await next()
}

module.exports = auth
