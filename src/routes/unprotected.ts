import Router from '@koa/router'
import { auth, user } from '../controller'
import findRoot from 'find-root'
import send from 'koa-send'

const unprotectedRouter = new Router()

// Auth

unprotectedRouter.post('/login', auth.loginUser)
unprotectedRouter.get('/refresh', auth.refreshToken)

// User
unprotectedRouter.post('/users', user.createUser)

// Static assets
const staticAge = {
    oneHourMs: 1000 * 60 * 60,
    oneDayMs: 1000 * 60 * 60 * 24,
    oneYearMs: 1000 * 60 * 60 * 24 * 365
}

const serveBase = process.env.NODE_ENV === 'production' ? '/dist/public/' : '/public/'

unprotectedRouter.get('/', async ctx => send(ctx, ctx.path, { 
    root: `${findRoot(__dirname)}${serveBase}`, 
    index: 'index.html',
    immutable: true,
	maxAge: staticAge.oneYearMs,
}))

unprotectedRouter.get('/readme.html', async ctx => send(ctx, ctx.path, { 
    root: `${findRoot(__dirname)}${serveBase}`, 
    immutable: true,
	maxAge: staticAge.oneDayMs,
}))

unprotectedRouter.get('/favicon.ico', async ctx => send(ctx, ctx.path, { 
    root: `${findRoot(__dirname)}${serveBase}`, 
    immutable: true,
	maxAge: staticAge.oneDayMs,
}))

unprotectedRouter.get('/assets/', async ctx => send(ctx, ctx.path, { 
    root: `${findRoot(__dirname)}${serveBase}`, 
    immutable: true,
	maxAge: staticAge.oneDayMs,
}))

export { unprotectedRouter }
