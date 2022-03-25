import Koa from 'koa'
import KoaBodyParser from 'koa-bodyparser'

import { router } from './router'
import { errorHandler } from './lib/middleware/errorHandler'

export const app = new Koa()



// app.use(KoaBody({multipart:true}))
app.use(errorHandler)
app.use(KoaBodyParser())

app.use(router.routes()).use(router.allowedMethods())

app.proxy = true
