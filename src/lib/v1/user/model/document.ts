import { Document, Types } from 'mongoose';

//
export interface IUserDocument extends Document<Types.ObjectId> {
  _id: Types.ObjectId,
  name: string,
  description: string,
  dob: string,
  address: string,
  createdAt: string,
  updatedAt: string,
}

export const DEFAULT_USER_PROJECTION
  : { [key in string]: 1 | 0 } = {
  name: 1,
  description: 1,
  dob: 1,
  address: 1,
  _id: 0,
};
