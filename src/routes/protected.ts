import { SwaggerRouter } from 'koa-swagger-decorator'
import { user, auth } from '../controller'
import { description } from '../utils/html_content'

const protectedRouter = new SwaggerRouter()

// AUTH ROUTES
protectedRouter.get('/logout', auth.logoutUser)

// USER ROUTES
protectedRouter.get('/users', user.getUsers)
protectedRouter.get('/users/:id', user.getUser)
protectedRouter.put('/users/:id', user.updateUser)
protectedRouter.delete('/users/:id', user.deleteUser)
protectedRouter.delete('/testusers', user.deleteTestUsers)

protectedRouter.swagger({
    title: 'wiredcraft-restful-api',
    description: description,
    version: '1.0.0',
})

// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(__dirname + '/../')

export { protectedRouter }
