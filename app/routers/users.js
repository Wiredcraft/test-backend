const Router = require('koa-router')
const joi = require('@hapi/joi')
  .extend(require('@hapi/joi-date'))

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
 * @apiUse UserResponse
 *
 *
 */
router.post('/', validate({
  body: joi.object().keys({
    name: joi.string().required(),
    dob: joi.date().format('YYYY-MM-DD').required(),
    address: joi.string().required(),
    description: joi.string().required()
  })
}
), async ctx => {
  const data = ctx.request.body
  ctx.body = await userServices.createUser(data)
})

/**
 * @api {get} /users Get users
 * @apiVersion 1.0.0
 * @apiUse General
 * @apiUse Pagination
 * @apiParam {string} query
 * @apiName searchUser
 * @apiGroup users
 * @apiUse UsersResponse
 *
 *
 */
router.get('/', validate({
  body: joi.object().keys({
    query: joi.string().optional(),
    offset: joi.number().optional(),
    limit: joi.number().optional()
  })
}
), async ctx => {
  let { query, offset, limit } = ctx.request.query
  offset = parseInt(offset, 10) || 0
  limit = parseInt(limit, 10) || 10
  ctx.body = await userServices.searchUser(query, offset, limit)
})

module.exports = router
