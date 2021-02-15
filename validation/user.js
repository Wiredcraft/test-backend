const Joi = require('joi');

module.exports = {
  postUser: Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      dob: Joi.string().required(),
      address: Joi.string().required(),
      description: Joi.string().required()
    }).required()
  }).unknown(),
  getUser: Joi.object({
    params: Joi.object({
      userId: Joi.string().required(),
    }).required()
  }).unknown(),
  deleteUser: Joi.object({
    params: Joi.object({
      userId: Joi.string().required(),
    }).required()
  }).unknown(),
  putUser: Joi.object({
    params: Joi.object({
      userId: Joi.string().required(),
    }).required(),
    body: Joi.object({
      name: Joi.string().required(),
      dob: Joi.string().required(),
      address: Joi.string().required(),
      description: Joi.string().required()
    }).required()
  }).unknown(),
}
