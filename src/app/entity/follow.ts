import { prop, Ref } from '@typegoose/typegoose';

import { User } from './user';
import { BaseModel } from './base';

export class Follow extends BaseModel {
  @prop({ ref: 'UserModel' })
  follower: Ref<User>;

  @prop({ ref: 'UserModel' })
  following: Ref<User>;
}
