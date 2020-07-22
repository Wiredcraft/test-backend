const Router = require('koa-router')
const joi = require('joi')

const userServices = require('../services/user')
const { validate, JWTAuthentication } = require('../middleware')
const router = new Router({
  prefix: '/users'
})

/**
 * @api {post} /users Create a user
 * @apiVersion 1.0.0
 * @apiUse General
 * @apiParam {string} name
 * @apiParam {string} dob format eg: 2018-10-10
 * @apiParam {string} address
 * @apiParam {string} description
 * @apiName CreateUser
 * @apiGroup users
 *
 * @apiSuccess {Object}  user
 *
 *
 */
router.post('/', validate({
  body: joi.object().keys({
    name: joi.string().required(),
    dob: joi.string().required(),
    address: joi.string().required(),
    description: joi.string().required()
  })
}
), async ctx => {
  const data = ctx.request.body
  ctx.body = await userServices.createUser(data)
})

module.exports = router
