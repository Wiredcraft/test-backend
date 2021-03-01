'use strict'

const Router = require('koa-router')
const userController = require('./controllers/user')

const router = new Router()

router.get('/users', userController.index)
router.get('/users/:id', userController.show)
router.post('/users', userController.create)
router.put('/users/:id', userController.update)
router.delete('/users/:id', userController.destroy)

module.exports = router
