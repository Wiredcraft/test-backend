import { Ref, prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { EntityModel } from '@midwayjs/typegoose';

import { BaseModel } from './base';
@EntityModel()
export class User extends BaseModel {
  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public dob: string;

  @prop({ ref: () => User })
  public friends?: Ref<User>[];

  @prop({
    index: true,
    unique: true,
    type: Schema.Types.String,
  })
  public username: string;

  @prop({ required: true })
  public password?: string;

  @prop({
    type: Object,
    index: '2dsphere',
  })
  public address?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export type UserType = User;
