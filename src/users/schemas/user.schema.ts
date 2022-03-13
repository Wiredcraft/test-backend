import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({
    default: null
  })
  job: string;

  @Prop({
    default: null
  })
  address: string;
  
  @Prop({
    default: null
  })
  description: string;

  @Prop({
    default: 0
  })
  isDelete: 1|0

}

export const UserSchema = SchemaFactory.createForClass(User);