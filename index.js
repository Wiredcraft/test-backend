const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const app = new Koa()
app.use(logger())
app.use(bodyparser({
    enableTypes: ['json']
}))
const index = require('./routes/index')
// log excuting duration
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(index.routes(), index.allowedMethods())

module.exports = app

// exports.handler({ path: '/users', body: { name: 'testName' }, queryParameters: {} }, {}, (err3, res) => { console.log(res) })