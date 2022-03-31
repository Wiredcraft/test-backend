import { createRouteParams, listRouteParams, patchRouteParams, updateRouteParams } from './types';
import { DEFAULT_USER_PROJECTION, IUserDocument, Users } from './model';
import { ERRORS } from '../../../consts';

export const createUser = async (params: createRouteParams): Promise<IUserDocument> => {
  const res = await Users.createUser(params);

  return res;
};

export const deleteUserById = async (userId: string): Promise<boolean> => {
  const res = await Users.deleteUserById(userId);

  return res;
};

export const patchUserById = async (userId: string, params: patchRouteParams): Promise<boolean> => {
  const res = await Users.patchUserById(userId, params);

  return res === null ? false : res.acknowledged;
};

export const updateUserById = async (userId: string, params: updateRouteParams): Promise<boolean> => {
  const res = await Users.updateUserById(userId, params);

  return res === null ? false : res.acknowledged;
};

export const getUserById = async (userId: string, projection: typeof DEFAULT_USER_PROJECTION): Promise<IUserDocument | never> => {
  const user: IUserDocument | undefined = await Users.getUserById(userId, projection);

  if (!user) {
    throw ERRORS.generic.not.found('Could not find user for provided userId', ['user_not_found']);
  }
  return user;
};

export const listUsers = async (params: listRouteParams, projection: typeof DEFAULT_USER_PROJECTION): Promise<IUserDocument[]> => {
  const res = await Users.getUsers(params, projection);

  return res
};

