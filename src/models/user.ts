import mongoose, { Schema, model } from 'mongoose';

export enum roles {
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
    role: {
      required: true,
      type: String,
      enum: Object.values(roles),
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
  dob: Date;
  address: string;
  description: string;
  role: roles;
  hashedPassword: string;
  lastLogin: Date;
}

interface UserDbInterface extends UserInterface, mongoose.Document {}
export default model<UserDbInterface>('User', userSchema);
