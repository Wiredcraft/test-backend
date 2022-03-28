import Koa from 'koa';
import { map } from 'lodash';

import {
  createRouteParams,
  patchRouteParams,
  updateRouteParams,
  validatorPatchRoute,
  validatorPostRoute,
  validatorUpdateRoute,
} from './validator';
import { ERRORS } from '../../../consts';
import { IUserDocument, Users } from './model/';


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
    throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '');
  }

  const res = await Users.createUser(value);

  ctx.body = res;
};


/**
 * Delete a user by ID
 * No need for a validator here, as not sending an ID would not land you here.
 * @param ctx
 */
export const deleteUser = async (ctx: Koa.Context): Promise<void> => {
  const res = await Users.deleteUserById(ctx.params.userId);

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

  const res = await Users.patchUserById(value.userId, value);

  if (res.acknowledged) {
    const retvalue = await Users.getUsersById(value.userId);
    ctx.body = retvalue;
  } else {
    throw ERRORS.generic.server.error('Could not patch user', []);
  }
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
    throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '');
  }

  const res = await Users.updateUserById(value.userId, value);


  if (res.acknowledged) {
    const retvalue = await Users.getUsersById(value.userId);
    ctx.body = retvalue;
  } else {
    throw ERRORS.generic.server.error('Could not patch user', []);
  }
};

/**
 * Return a user by ID.
 * No need for a validator here, as not sending an ID would not land you here.
 * @param ctx
 */
export const getUser = async (ctx: Koa.Context): Promise<void> => {
  const user: IUserDocument | undefined = await Users.getUsersById(ctx.params.userId);

  if (!user) {
    throw ERRORS.generic.not.found('Could not find user for provided userId', ['user_not_found']);
  }
  ctx.body = user;

};

/**
 * Return a list of all user.
 * TODO add pagination
 * @param ctx
 */
export const listUsers = async (ctx: Koa.Context): Promise<void> => {
  const users: IUserDocument[] = await Users.getUsers();

  ctx.body = users;
};
