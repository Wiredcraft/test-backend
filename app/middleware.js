const jwt = require('koa-jwt')
const config = require('config')

const validate = (schemas, options) => async (ctx, next) => {
  Object.keys(schemas).forEach(key => {
    const data = ctx.request[key]
    const schema = schemas[key]
    const { error } = schema.validate(data)
    if (error) {
      throw error
    }
  })
  return next()
}

const JWTAuthentication = jwt({
  secret: config.jwt.secret
})

module.exports = {
  validate,
  JWTAuthentication
}
