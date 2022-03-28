import Koa from 'koa';
import { map } from 'lodash';

import {
  validatorPatchRoute,
  validatorPostRoute,
  validatorUpdateRoute,
} from './validator';
import * as UserService from './service';
import { ERRORS } from '../../../consts';
import {
  createRouteParams,
  patchRouteParams,
  updateRouteParams,
} from './types';


/**
 * Create a user, return the user created with its new ID.
 * TODO Token here
 * @param ctx
 */
export const createUser = async (ctx: Koa.Context): Promise<void> => {
  const rawParams: createRouteParams = {
    name: ctx.request.body.name as string,
    dob: ctx.request.body.dob as string,
    address: ctx.request.body.address as string,
    description: ctx.request.body.description as string,
  };

  const { error, value } = validatorPostRoute(rawParams);

  if (error) {
    throw ERRORS.generic.validation.failed('', map(error.details, 'message'));
  }

  const res = await UserService.createUser(value);

  ctx.body = res;
};


/**
 * Delete a user by ID
 * No need for a validator here, as not sending an ID would not land you here.
 * @param ctx
 */
export const deleteUser = async (ctx: Koa.Context): Promise<void> => {
  const res = await UserService.deleteUserById(ctx.params.userId);

  ctx.body = res;
};


/**
 * Patch a user by ID. replace only what is given.
 * @param ctx
 */
export const patchUser = async (ctx: Koa.Context): Promise<void> => {
  const rawParams: patchRouteParams = {
    userId: ctx.params.userId as string,
    name: ctx.request.body.name as string,
    dob: ctx.request.body.dob as string,
    address: ctx.request.body.address as string,
    description: ctx.request.body.description as string,
  };

  const { error, value } = validatorPatchRoute(rawParams);

  if (error) {
    throw ERRORS.generic.validation.failed('', map(error.details, 'message'));
  }

  ctx.body = await UserService.patchUserById(value.userId, value);
};

/**
 * Update a user by ID. PUT method, takes a whole user to replace a user
 * @param ctx
 */
export const updateUser = async (ctx: Koa.Context): Promise<void> => {
  const rawParams: updateRouteParams = {
    userId: ctx.params.userId as string,
    name: ctx.request.body.name as string,
    dob: ctx.request.body.dob as string,
    address: ctx.request.body.address as string,
    description: ctx.request.body.description as string,
  };

  const { error, value } = validatorUpdateRoute(rawParams);

  if (error) {
    throw ERRORS.generic.validation.failed('', map(error.details, 'message'));
  }

  ctx.body = await UserService.updateUserById(value.userId, value);
};

/**
 * Return a user by ID.
 * No need for a validator here, as not sending an ID would not land you here.
 * @param ctx
 */
export const getUser = async (ctx: Koa.Context): Promise<void> => {
  ctx.body = await UserService.getUserById(ctx.params.userId);
};

/**
 * Return a list of all user.
 * TODO add pagination
 * @param ctx
 */
export const listUsers = async (ctx: Koa.Context): Promise<void> => {
  ctx.body = await UserService.listUsers();
};
