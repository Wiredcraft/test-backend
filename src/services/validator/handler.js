let Joi = require('joi')
let ObjectID = require('mongodb').ObjectID

const createSchema = Joi.object().keys({
  name: Joi.string().min(3).required(),
  dob: Joi.string().regex(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/),
  address: Joi.string().min(10).max(30),
  description: Joi.string().min(10).max(150)
})

const updateSchema = Joi.object().keys({
  name: Joi.string().min(3),
  dob: Joi.string().regex(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/),
  address: Joi.string().min(10).max(30),
  description: Joi.string().min(10).max(150)
})

let get = async function (data) {
  return { valid: ObjectID.isValid(data) }
}

let update = async function (data) {
  data = await cleanObject(data)
  let result = Joi.validate(data, updateSchema)
  if (!result.error) {
    return { valid: true, object: data }
  } else {
    return { valid: false }
  }
}

let del = async function (data) {
  return { valid: ObjectID.isValid(data) }
}

let create = async function (data) {
  data = await cleanObject(data)
  let result = Joi.validate(data, createSchema)
  if (!result.error) {
    return { valid: true, object: data }
  } else {
    return { valid: false }
  }
}

let cleanObject = async (o) => {
  for (let i in o) {
    if (!o[i]) {
      delete o[i]
    }
  }
  return o
}

module.exports = {
  get, create, del, update
}
