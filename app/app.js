const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const mount = require('koa-mount')
const serve = require('koa-static')
const path = require('path')
const _ = require('lodash')
const fs = require('fs')

const { AppError } = require('./error')
const logger = require('./logger')

const api = new Koa()

api.use(koaLogger())

api.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    logger.error(err, err.stack.split('\n'))
    if (err instanceof AppError) {
      ctx.body = JSON.parse(err.message)
      ctx.status = 200
    } else if (err.name === 'ValidationError') {
      ctx.status = 400
      ctx.body = {
        errorCode: -2,
        message: _.map(err.details, 'message').join(' ,')
      }
    } else {
      ctx.body = {
        errorCode: -1,
        message: err.message
      }
      ctx.status = err.statusCode || err.status || 500
    }
  }
})

api.use(bodyParser())
const routerDir = path.resolve(path.join(__dirname, 'routers'))
fs.readdirSync(routerDir).forEach(file => {
  const filename = file.split('.')[0]
  const ext = path.extname(file)
  if (ext === '.js') {
    logger.info('load routers from ', filename)
    const router = require(`./routers/${filename}`)
    if (!_.isEmpty(router)) {
      router.stack.map(it => {
        logger.info('methods:%s : %s', _.without(it.methods, 'HEAD', 'OPTIONS'), it.path)
      })
      api.use(router.routes())
        .use(router.allowedMethods())
    }
  }
})

// api doc
const staticApp = new Koa()
const apidocDir = path.resolve(path.join(path.dirname(__dirname), 'apidoc'))
staticApp.use(serve(apidocDir))

const app = new Koa()

app.use(mount('/api/v1', api))
app.use(mount('/apidoc/', staticApp))

module.exports = app
