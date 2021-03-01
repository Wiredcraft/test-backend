'use strict'

const Joi = require('joi')

async function errorHandler(ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err instanceof Joi.ValidationError) {
      ctx.status = 400
      if (process.env.NODE_ENV === 'development') {
        ctx.body = err.message
      }
    } else {
      console.error(err)
      ctx.status = 500
      if (process.env.NODE_ENV === 'development') {
        ctx.body = err.stack
      }
    }
  }
}

module.exports = errorHandler
