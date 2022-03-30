import { createRouteParams, listRouteParams, patchRouteParams, updateRouteParams } from './types';
import { IUserDocument, Users } from './model';
import { ERRORS } from '../../../consts';

export const createUser = async (params: createRouteParams): Promise<IUserDocument> => {
  const res = await Users.createUser(params);

  return res;
};

export const deleteUserById = async (userId: string): Promise<boolean> => {
  const res = await Users.deleteUserById(userId);

  return res;
};

export const patchUserById = async (userId: string, params: patchRouteParams): Promise<IUserDocument | never> => {
  const res = await Users.patchUserById(userId, params);

  if (res.acknowledged) {
    const returnValue = await Users.getUsersById(userId);
    if (returnValue) {
      return returnValue;
    }
  }
  throw ERRORS.generic.server.error('Could not patch user', []);
};

export const updateUserById = async (userId: string, params: updateRouteParams): Promise<IUserDocument | never> => {
  const res = await Users.updateUserById(userId, params);


  if (res.acknowledged) {
    const returnValue = await Users.getUsersById(userId);
    if (returnValue) {
      return returnValue;
    }
  }
  throw ERRORS.generic.server.error('Could not update user', []);
};

export const getUserById = async (userId: string): Promise<IUserDocument | never> => {
  const user: IUserDocument | undefined = await Users.getUsersById(userId);

  if (!user) {
    throw ERRORS.generic.not.found('Could not find user for provided userId', ['user_not_found']);
  }
  return user;
};

export const listUsers = async (params: listRouteParams): Promise<IUserDocument[]> => {
  return Users.getUsers(params);
};
