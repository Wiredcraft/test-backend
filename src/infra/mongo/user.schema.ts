import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserInMongo {
  @Prop()
  name: string;
  @Prop()
  dob: Date;
  @Prop()
  address: string;
  @Prop()
  description: string;
  @Prop()
  createdAt: Date;
}

export type UserDocument = UserInMongo & Document;
export const UserSchema = SchemaFactory.createForClass(UserInMongo);
