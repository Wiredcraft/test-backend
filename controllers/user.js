'use strict'

const Joi = require('joi')
const User = require('../models/User')

const idSchema = Joi.string().pattern(/^\w{24}$/)

const userSchema = Joi.object({
  name: Joi.string().required(),
  dob: Joi.date(),
  address: Joi.string(),
  description: Joi.string(),
})


const handleUser = (user) => {
  if (Array.isArray(user)) return user.map(handleUser)
  return {
    id: user.id,
    name: user.name,
    dob: user.dob || '',
    address: user.address || '',
    description: user.description || '',
    createdAt: user.createdAt,
  }
}


async function index(ctx) {
  const users = await User.find({})
  ctx.body = handleUser(users)
}

async function show(ctx) {
  const { id } = ctx.params
  ctx.validate(idSchema, id)

  const user = await User.findById(id)
  if (!user) {
    ctx.status = 404
    return
  }

  ctx.body = handleUser(user)
}

async function create(ctx) {
  const payload = ctx.validate(userSchema, ctx.request.body)
  const user = await User.create(payload)

  ctx.status = 201
  ctx.body = { id: user.id }
}

async function update(ctx) {
  const { id } = ctx.params
  ctx.validate(idSchema, id)
  const payload = ctx.validate(userSchema, ctx.request.body)

  const user = await User.findById(id)
  if (!user) {
    ctx.status = 404
    return
  }
  
  user.name = payload.name
  user.dob = payload.dob
  user.address = payload.address
  user.description = payload.description
  await user.save()

  ctx.status = 204
}

async function destroy(ctx) {
  const { id } = ctx.params
  ctx.validate(idSchema, id)

  const user = await User.findById(id)
  if (!user) {
    ctx.status = 404
    return
  }

  await user.delete()

  ctx.status = 204
}

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
}
