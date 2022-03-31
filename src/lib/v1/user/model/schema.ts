import { Types } from 'mongoose';
import { UpdateResult } from 'mongodb';

import * as db from '../../../utils/mongoDb';
import { IUserDocument } from './document';
import { createRouteParams, listRouteParams, patchRouteParams, updateRouteParams } from '../types';
import { Users } from './index';

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
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      getters: true,
      versionKey: false,
    },
  },
);

Schema.statics.getUsers = async function getUsers(params: listRouteParams): Promise<IUserDocument[]> {
  const sortParam: { [key in string]: 'asc' | 'desc' } = {};
  sortParam[params.orderBy] = params.orderDir;
  return this.find({}, {})
    .limit(params.perPage)
    .skip(params.perPage * (params.page - 1))
    .sort(sortParam).exec();
};

Schema.statics.getUsersById = async function getUsersById(userId: string): Promise<IUserDocument | undefined> {
  const query = this.findById(new Types.ObjectId(userId));

  console.log(query.getFilter())
  console.log(query.getFilter()._id instanceof Types.ObjectId)
  const resultat =  await query.exec()

  return resultat
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
