import { Model } from 'mongoose';
import { DEFAULT_USER_PROJECTION, IUserDocument } from './document';
import { createRouteParams, patchRouteParams, updateRouteParams } from '../types';
import { UpdateResult } from 'mongodb';
import { listRouteParams } from '../types';

/**
 * This class holds the function declarations for the user collection
 */
export interface IUserModel extends Model<IUserDocument> {
  getUsers(params: listRouteParams, projection: typeof DEFAULT_USER_PROJECTION): Promise<IUserDocument[]>;

  getUserById(userId: string, projection: typeof DEFAULT_USER_PROJECTION): Promise<IUserDocument | undefined>;

  patchUserById(userId: string, params: patchRouteParams): Promise<UpdateResult>;

  updateUserById(userId: string, params: updateRouteParams): Promise<UpdateResult>;

  createUser(params: createRouteParams): Promise<IUserDocument>;

  deleteUserById(userId: string): Promise<boolean>;
}
