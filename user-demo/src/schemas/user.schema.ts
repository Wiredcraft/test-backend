import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document{
    @Prop()
    id:number;
    
    @Prop()
    name:string;
    
    @Prop()
    dob:string;

    @Prop()
    address:string;

    @Prop()
    description:string;

    @Prop()
    createdAt:string
}

export const UserSchema = SchemaFactory.createForClass(User);