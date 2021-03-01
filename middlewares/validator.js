'use strict'

function validate(schema, value) {
  const res = schema.validate(value)
  if (res.error) throw res.error
  return res.value
}

async function validator(ctx, next) {
  ctx.validate = validate
  await next()
}

module.exports = validator
