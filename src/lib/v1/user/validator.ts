import Joi from 'joi';

import { config } from '../../../config';
import { createRouteParams, listRouteParams, patchRouteParams, updateRouteParams } from './types';

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


export const validatorListRoute = (params: listRouteParams): Joi.ValidationResult => {
  return Joi.object({
    perPage: Joi.number()
      .max(config.pagination.userList.maxPerPage)
      .failover(config.pagination.userList.defaultPerPage),
    page: Joi
      .number()
      .failover(1),
    orderBy: Joi.string().default(config.pagination.userList.order.field).allow(...["dob", "name", "createdAt", "updatedAt"]),
    orderDir: Joi.string().default(config.pagination.userList.order.direction).allow(...["asc", "desc"])

  }).validate(params);
};

