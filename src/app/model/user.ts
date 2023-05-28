import { EntityModel } from '@midwayjs/orm';
import { Column, ObjectIdColumn, ObjectID } from 'typeorm';

import { BaseModel } from './base';

@EntityModel({
  name: 'users',
})
export class UserModel extends BaseModel {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  dob: string;

  @Column()
  friendList: ObjectID[];

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  location: any;
}
