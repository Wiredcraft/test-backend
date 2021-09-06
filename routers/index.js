const config = require('../config')
const router = require('koa-router')({ prefix: '/users' })
const { userController } = require('../controller')
const jwt = require('jsonwebtoken')

const authJwt = async function (ctx, next) {
    const token = ctx.request.headers['token']
    if (token) {
      try {
        const userData = jwt.verify(token, config.cert, { algorithms: ['RS256'] })
        ctx.userId = userData.id
      } catch (err) {
        ctx.throw(401, 'Unauthorized')
        return
      }
      await next()
      return
    }
    ctx.throw(403, 'Forbidden')
    return
}

router.all('/*', authJwt)
router.get('/:id', userController.get)
router.post('/', userController.create)
router.put('/:id', userController.update)
router.delete('/:id', userController.delete)

router.post('/:id/followers/following', userController.follow)
router.delete('/:id/followers/following', userController.unfollow)
router.get('/:id/followers/following', userController.followingUsers)
router.get('/:id/friends', userController.friends)

module.exports = router