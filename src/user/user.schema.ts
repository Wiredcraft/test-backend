import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSchema } from '../base.schema';
@Schema()
export class User extends BaseSchema {
  @ApiProperty({ description: '用户名' })
  @Prop({ required: true, unique: true })
  userName: string;

  @ApiProperty({ description: '密码' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ description: '姓名' })
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty({ description: '出生时间' })
  @ApiProperty()
  @Prop({ type: Date })
  dob: Date;


  @ApiProperty({ description: '地址' })
  @Prop()
  address: string;

  @ApiProperty({ description: '简介' })
  @ApiProperty()
  @Prop()
  description: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
