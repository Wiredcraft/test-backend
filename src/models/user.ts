import mongoose, { Schema, model } from 'mongoose';

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
