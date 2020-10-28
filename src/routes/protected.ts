import { SwaggerRouter } from 'koa-swagger-decorator'
import { user, auth } from '../controller'

const protectedRouter = new SwaggerRouter()

// AUTH ROUTES
protectedRouter.get('/logout', auth.logoutUser)

// USER ROUTES
protectedRouter.get('/users', user.getUsers)
protectedRouter.get('/users/:id', user.getUser)
protectedRouter.put('/users/:id', user.updateUser)
protectedRouter.delete('/users/:id', user.deleteUser)
protectedRouter.delete('/testusers', user.deleteTestUsers)

// Swagger endpoint
protectedRouter.swagger({
    title: 'wiredcraft-restful-api',
    description: 'RESTful API using NodeJS, KOA, Typescript and TypeORM. Middleware uses JWT, CORS, Winston Logger.',
    version: '1.0.0',
})

// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(__dirname + '/../')

export { protectedRouter }
