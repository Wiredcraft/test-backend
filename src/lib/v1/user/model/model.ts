import { Model } from 'mongoose';
import { IUserDocument } from './document';
import { createRouteParams, patchRouteParams, updateRouteParams } from '../types';
import { UpdateResult } from 'mongodb';
import { listRouteParams } from '../types';

export interface IUserModel extends Model<IUserDocument> {
  getUsers(params: listRouteParams): Promise<IUserDocument[]>;

  getUsersById(userId: string): Promise<IUserDocument | undefined>;

  patchUserById(userId: string, params: patchRouteParams): Promise<UpdateResult>;

  updateUserById(userId: string, params: updateRouteParams): Promise<UpdateResult>;

  createUser(params: createRouteParams): Promise<IUserDocument>;

  deleteUserById(userId: string): Promise<boolean>;
}
