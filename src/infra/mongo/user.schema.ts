import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserId } from '../../domain/user.interface';

@Schema()
export class UserInMongo {
  @Prop({ unique: true, minlength: 1, maxlength: 36 })
  id: UserId;
  @Prop({ minlength: 1, maxlength: 50 })
  name: string;
  @Prop()
  dob: Date;
  @Prop({ maxlength: 30 })
  address: string;
  @Prop({ maxlength: 160 })
  description: string;
  @Prop()
  createdAt: Date;
}

export type UserDocument = UserInMongo & Document;
export const UserSchema = SchemaFactory.createForClass(UserInMongo);
