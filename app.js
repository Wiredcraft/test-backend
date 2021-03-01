'use strict'

const Koa = require('koa')
require('./models')

const app = new Koa()

app.use(require('koa-bodyparser')())
app.use(require('./middlewares/logger'))
app.use(require('./middlewares/errorHandler'))
app.use(require('./middlewares/validator'))

const router = require('./router')
app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
