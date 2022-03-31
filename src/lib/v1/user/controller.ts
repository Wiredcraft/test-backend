import Koa from 'koa';
import { map } from 'lodash';

import {
  validatorListRoute,
  validatorPatchRoute,
  validatorPostRoute,
  validatorUpdateRoute,
} from './validator';
import * as UserService from './service';
import { ERRORS } from '../../../consts';
import {
  createRouteParams, listRouteParams,
  patchRouteParams,
  updateRouteParams,
} from './types';
import { isTesting } from '../../../config';
import { DEFAULT_USER_PROJECTION, Users } from './model';


/**
 * Create a user, return the user created with its new ID.
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

  const res = await UserService.patchUserById(value.userId, value);

  if (res) {
    const returnValue = await Users.getUserById(value.userId, DEFAULT_USER_PROJECTION);
    if (returnValue) {
      ctx.body = returnValue;
      return;
    }
  }
  throw ERRORS.generic.server.error('Could not update user', []);
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

  const res = await UserService.updateUserById(value.userId, value);
  if (res) {
    const returnValue = await Users.getUserById(value.userId, DEFAULT_USER_PROJECTION);
    if (returnValue) {
      ctx.body = returnValue;
      return;
    }
  }
  throw ERRORS.generic.server.error('Could not update user', []);
};

/**
 * Return a user by ID.
 * No need for a validator here, as not sending an ID would not land you here.
 * @param ctx
 */
export const getUser = async (ctx: Koa.Context): Promise<void> => {
  ctx.body = await UserService.getUserById(ctx.params.userId, DEFAULT_USER_PROJECTION);
};

/**
 * Return a list of all user.
 * TODO add pagination
 * @param ctx
 */
export const listUsers = async (ctx: Koa.Context): Promise<void> => {
  const rawParams: listRouteParams = {
    perPage: Number.parseFloat(ctx.request.query.perPage as string),
    page: Number.parseFloat(ctx.request.query.page as string),
    orderDir: ctx.request.query.orderDir as 'asc' | 'desc',
    orderBy: ctx.request.query.orderBy as string,
  };

  const { error, value } = validatorListRoute(rawParams);

  if (error) {
    throw ERRORS.generic.validation.failed('', map(error.details, 'message'));
  }

  let projection = DEFAULT_USER_PROJECTION;

  // If we are in testing mode keep createdAt so that we can test
  // sorting by createdAt.
  if (isTesting) {
    projection = {
      ...DEFAULT_USER_PROJECTION,
      createdAt: 1,
    };
  }

  ctx.body = await UserService.listUsers(value, projection);
};
