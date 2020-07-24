const jwt = require('koa-jwt')
const config = require('config')
const { panic } = require('./error')

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

const onlyAllowSelf = async (ctx, next) => {
  const { id } = ctx.params
  const userId = ctx.state.user.id
  if (id && userId && id !== userId) {
    panic(1001, 'You don\'t have permission to do that ')
  }
  return next()
}

const JWTAuthentication = jwt({
  secret: config.jwt.secret
})

module.exports = {
  validate,
  onlyAllowSelf,
  JWTAuthentication
}
