import { createRouteParams, patchRouteParams, updateRouteParams } from './types';

import Joi from 'joi';

export const validatorPatchRoute = (params: patchRouteParams): Joi.ValidationResult => {
  return Joi.object({
    userId: Joi.string().required(),
    name: Joi.string(),
    dob: Joi.string(),
    address: Joi.string(),
    description: Joi.string(),
  }).validate(params);
};

export const validatorPostRoute = (params: createRouteParams): Joi.ValidationResult => {
  return Joi.object({
    name: Joi.string().required(),
    dob: Joi.string().required(),
    address: Joi.string().required(),
    description: Joi.string().required(),
  }).validate(params);
};

export const validatorUpdateRoute = (params: updateRouteParams): Joi.ValidationResult => {
  return Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    dob: Joi.string().required(),
    address: Joi.string().required(),
    description: Joi.string().required(),
  }).validate(params);
};


