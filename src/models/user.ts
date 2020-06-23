import mongoose, { model, Schema } from 'mongoose';

import { AccessInterface } from './access';

export enum Roles {
  admin = 'admin',
  operator = 'operator',
  user = 'user',
}

/**
 * User
 *
 * @property {string} name (required)
 * @property {Date} dob
 * @property {string} address
 * @property {string} description
 * @property {string} role (required)
 * @property {string} hashedPassword (required)
 * @property {Date} lastLogin
 *
 */
export const userSchema = new Schema(
  {
    name: {
      unique: true,
      index: true,
      type: String,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    followers: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    role: {
      required: true,
      type: String,
      enum: Object.values(Roles),
    },
    access: {
      type: Schema.Types.Mixed,
    },
    hashedPassword: {
      required: true,
      type: String,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true, collection: 'User' }
);

export interface UserInterface {
  name: string;
  access: AccessInterface;
  dob: Date;
  address: string;
  description: string;
  following: UserInterface[];
  followers: UserInterface[];
  latitude: number;
  longitude: number;
  role: Roles;
  hashedPassword: string;
  lastLogin: Date;
}

interface UserDbInterface extends UserInterface, mongoose.Document {}
export default model<UserDbInterface>('User', userSchema);
