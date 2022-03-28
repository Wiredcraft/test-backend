import { IUserModel } from './model';
import { IUserDocument } from './document';
import { Schema } from './schema';
import * as db from '../../../utils/mongoDb';

export const Users: IUserModel = db.mongoose.model<IUserDocument, IUserModel>('User', Schema);

export * from './document';
