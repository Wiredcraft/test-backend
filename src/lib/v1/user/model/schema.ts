import { Types } from 'mongoose';
import { UpdateResult } from 'mongodb';

import * as db from '../../../utils/mongoDb';
import { DEFAULT_USER_PROJECTION, IUserDocument } from './document';
import {
  createRouteParams,
  listRouteParams,
  patchRouteParams,
  updateRouteParams,
} from '../types';
import { Users } from './index';


// This is the schema for the users collection. In this file are the
// implementations of the functions declared in the model.
// If we need special treatment of the values returned by database
// (eg: formatting of the address/dob, changing the name of fields) it could be
// done here with some virtuals.
export const Schema = new db.mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    dob: {
      type: String,
    },
    address: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    // timestamps fill createdAt and updatedAt for us.
    timestamps: true,
    collection: 'users',
    toJSON: {
      getters: true,
      versionKey: false,
    },
  },
);

Schema.statics.getUsers = async function getUsers(params: listRouteParams, projection: typeof DEFAULT_USER_PROJECTION): Promise<IUserDocument[]> {
  // Mongo takes the sorting parameters as {key: direction}
  const sortParam: { [key in string]: 'asc' | 'desc' } = {};
  sortParam[params.orderBy] = params.orderDir;

  return this.find({}, projection)
    .limit(params.perPage)
    .skip(params.perPage * (params.page - 1))
    .sort(sortParam).exec();
};

Schema.statics.getUserById = async function getUserById(userId: string, projection: typeof DEFAULT_USER_PROJECTION): Promise<IUserDocument | undefined> {
  return this.findById(new Types.ObjectId(userId), projection);
};

Schema.statics.patchUserById = async function patchUserById(userId: string, params: patchRouteParams): Promise<UpdateResult> {
  return this.updateOne({ _id: new Types.ObjectId(userId) }, params);
};

Schema.statics.updateUserById = async function updateUserById(userId: string, params: updateRouteParams): Promise<UpdateResult> {
  return this.updateOne({ _id: new Types.ObjectId(userId) }, params);
};

Schema.statics.createUser = async function createUser(params: createRouteParams): Promise<IUserDocument> {
  const user = new Users({
    _id: new db.mongoose.Types.ObjectId(),
    ...params,
  });

  return user.save();
};

Schema.statics.deleteUserById = async function deleteUserById(userId: string): Promise<boolean> {
  return this.deleteOne({ _id: new Types.ObjectId(userId) });
};
