import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserId } from '../../domain/user.interface';

@Schema()
export class UserInMongo {
  @Prop({ unique: true })
  id: UserId;
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
