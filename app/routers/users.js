const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const joi = require('@hapi/joi')
  .extend(require('@hapi/joi-date'))

const userServices = require('../services/user')
const { validate, JWTAuthentication, onlyAllowSelf } = require('../middleware')
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
 * @apiName createUser
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
  const user = await userServices.createUser(data)
  const token = jwt.sign({ id: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  })
  ctx.body = {
    ...user,
    token
  }
})

/**
 * @api {put} /users/:id Fullly update an user
 * @apiVersion 1.0.0
 * @apiUse GeneralAuth
 * @apiParam {string} id
 * @apiParam {string} name
 * @apiParam {string} dob format eg: 2018-10-10
 * @apiParam {string} address
 * @apiParam {string} description
 * @apiName fullyUpdateUser
 * @apiGroup users
 * @apiUse UserResponse
 *
 *
 */
router.put('/:id', JWTAuthentication, onlyAllowSelf, validate({
  body: joi.object().keys({
    name: joi.string().required(),
    dob: joi.date().format('YYYY-MM-DD').required(),
    address: joi.string().required(),
    description: joi.string().required()
  })
}
), async ctx => {
  const data = ctx.request.body
  const { id } = ctx.params
  const user = await userServices.updateUser(id, data)
  ctx.body = user
})

/**
 * @api {patch} /users/:id Partially update an user
 * @apiVersion 1.0.0
 * @apiUse GeneralAuth
 * @apiParam {string} id
 * @apiParam {string} name
 * @apiParam {string} dob format eg: 2018-10-10
 * @apiParam {string} address
 * @apiParam {string} description
 * @apiName partiallyUpdateUser
 * @apiGroup users
 * @apiUse UserResponse
 *
 *
 */
router.patch('/:id', JWTAuthentication, onlyAllowSelf, validate({
  body: joi.object().keys({
    name: joi.string().allow('').optional(),
    dob: joi.date().format('YYYY-MM-DD').allow('').optional(),
    address: joi.string().allow('').optional(),
    description: joi.string().allow('').optional()
  })
}
), async ctx => {
  const data = _.pickBy(ctx.request.body, _.identity)
  const { id } = ctx.params
  const user = await userServices.updateUser(id, data)
  ctx.body = user
})

/**
 * @api {delete} /users/:id Delete an user
 * @apiVersion 1.0.0
 * @apiUse GeneralAuth
 * @apiParam {string} id
 * @apiName deleteUser
 * @apiGroup users
 * @apiUse UserResponse
 *
 *
 */
router.delete('/:id', JWTAuthentication, onlyAllowSelf, async ctx => {
  const { id } = ctx.params
  await userServices.deleteUser(id)
  ctx.body = null
})

/**
 * @api {get} /users/:id Get an user
 * @apiVersion 1.0.0
 * @apiUse GeneralAuth
 * @apiParam {string} the id you want to find, or pass me to find the user self
 * @apiName getUser
 * @apiGroup users
 * @apiUse UserResponse
 *
 *
 */
router.get('/:id', JWTAuthentication, async ctx => {
  const { id } = ctx.params
  const user = await userServices.getUser(id)
  ctx.body = user
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
