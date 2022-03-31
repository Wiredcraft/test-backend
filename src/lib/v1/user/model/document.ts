import { Document, Types } from 'mongoose';

export interface IUserDocument extends Document<Types.ObjectId> {
  _id: Types.ObjectId,
  name: string,
  description: string,
  dob: string,
  createdAt: string,
  updatedAt: string,
}
