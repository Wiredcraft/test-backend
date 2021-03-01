'use strict'

async function loggerMiddleware(ctx, next) {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} ${ctx.status} ${ctx.length || 0} - ${ms}ms`)
}

module.exports = loggerMiddleware
