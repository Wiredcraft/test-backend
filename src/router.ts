import Router from 'koa-router'
import glob from 'glob'
import path from 'path'
import Koa from 'koa'
import { isFunction } from "lodash"

import { config } from './config'

export const router = new Router()

router.get('/ping', (ctx: Koa.Context) => {
    ctx.body = { status: 'OK' }
})

router.get('/', (ctx: Koa.Context) => {
    ctx.body = { name: config.appName, version: config.version }
})

const api = new Router()

console.log(process.cwd())

glob.sync('./v1/**/router.ts', { cwd: './src/lib' }).forEach((routerPath) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const router = require(`./lib/${routerPath}`)
    if (!isFunction(router.router.routes)) return

    const namespace = path
        .dirname(routerPath)
        .split(path.sep)
        .slice(2)
        .join(path.sep)

    api.use(`/v1/${namespace}`, router.router.routes())
})

router.use(api.routes())
