import Koa from 'koa';
import { pickBy, identity } from 'lodash';

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
  const res = await UserService.createUser(ctx.body as createRouteParams);

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
  const params = ctx.body as patchRouteParams;

  // This bit of code is to make sure at least one field other than id is provided.
  // If a field is not provided it will be undefined here. so we filter out undefined
  // values and make sure there is not just id in value.
  const cleanedObject = pickBy(params, identity);
  if (Object.keys(cleanedObject).length <= 1) {
    throw ERRORS.generic.validation.failed('', ['Need to give at least one field']);
  }
  const res = await UserService.patchUserById(params.userId as string, params);

  if (res) {
    const returnValue = await Users.getUserById(params.userId as string, DEFAULT_USER_PROJECTION);
    if (returnValue) {
      ctx.body = returnValue;
      return;
    }
  }
  throw ERRORS.generic.not.found('User not found', []);
};

/**
 * Update a user by ID. PUT method, takes a whole user to replace a user
 * @param ctx
 */
export const updateUser = async (ctx: Koa.Context): Promise<void> => {
  const params = ctx.body as updateRouteParams;

  const res = await UserService.updateUserById(params.userId as string, params);
  if (res) {
    const returnValue = await Users.getUserById(params.userId as string, DEFAULT_USER_PROJECTION);
    if (returnValue) {
      ctx.body = returnValue;
      return;
    }
  }
  throw ERRORS.generic.not.found('User not found', []);
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
 * @param ctx
 */
export const listUsers = async (ctx: Koa.Context): Promise<void> => {
  let projection = DEFAULT_USER_PROJECTION;

  // If we are in testing mode keep createdAt so that we can test
  // sorting by createdAt.
  if (isTesting) {
    projection = {
      ...DEFAULT_USER_PROJECTION,
      createdAt: 1,
    };
  }

  ctx.body = await UserService.listUsers(ctx.body as listRouteParams, projection);
};
