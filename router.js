'use strict'

const Router = require('koa-router')
const auth = require('./middlewares/auth')
const authController = require('./controllers/auth')
const userController = require('./controllers/user')

const router = new Router()

router.post('/login', authController.login)

router.get('/users', auth, userController.index)
router.get('/users/:id', auth, userController.show)
router.post('/users', auth, userController.create)
router.put('/users/:id', auth, userController.update)
router.delete('/users/:id', auth, userController.destroy)

module.exports = router
