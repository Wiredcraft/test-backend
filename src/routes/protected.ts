import { SwaggerRouter } from 'koa-swagger-decorator'
import { user, auth } from '../controller'
import { description } from '../utils/html_content'

const protectedRouter = new SwaggerRouter()

// AUTH ROUTES
protectedRouter.get('/logout', auth.logoutUser)

// USER ROUTES
protectedRouter.get('/users', user.getUsers)
protectedRouter.get('/users/:id', user.getUser)
protectedRouter.patch('/users/:id', user.updateUser)
protectedRouter.patch('/users/follow/:id', user.followUser)
protectedRouter.patch('/users/unfollow/:id', user.unfollowUser)
protectedRouter.get('/users/:id/followers', user.getFollowers)
protectedRouter.get('/users/:id/following', user.getFollowing)
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
