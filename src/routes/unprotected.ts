import Router from '@koa/router'
import { general, auth, user } from '../controller'

const unprotectedRouter = new Router()

// Auth
unprotectedRouter.post('/login', auth.loginUser)
unprotectedRouter.get('/refresh', auth.refreshToken)
// User
unprotectedRouter.post('/users', user.createUser)

// General
unprotectedRouter.get('/', general.helloWorld)

export { unprotectedRouter }
