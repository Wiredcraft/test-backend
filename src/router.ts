import Router from 'koa-router'
import glob from 'glob'
import path from 'path'
import Koa from 'koa'

import { config } from './config'

export const router = new Router()

router.get('/ping', (ctx: Koa.Context) => {
    ctx.body = { status: 'OK' }
})

router.get('/', (ctx: Koa.Context) => {
    ctx.body = { name: config.appName, version: config.version }
})

const api = new Router()
glob.sync('./v1/**/router.ts', { cwd: './lib' }).forEach((routerPath) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const router = require(routerPath)
    if (typeof router.router.routes === "function") return

    const namespace = path
        .dirname(routerPath)
        .split(path.sep)
        .slice(2)
        .join(path.sep)

    api.use(`/${namespace}`, router.router.routes())
})

router.use(api.routes())
