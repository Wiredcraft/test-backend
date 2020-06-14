import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema( { timestamps: true } )
export class User extends Document {

	//  _id & Timestamps are created with the help of mongoose Schema options and as such do not need @Prop annotations
	_id: Types.ObjectId;

	@Prop()
	name: string;

	@Prop( { type: Date } )
	dob: Date;

	@Prop()
	address: string;

	@Prop()
	description: string;

	createdAt: Date;

	updatedAt: Date;
}


export const UserSchema = SchemaFactory.createForClass( User );
