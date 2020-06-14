import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose, Transform } from "class-transformer";
import { Document, Types } from "mongoose";


@Schema( { timestamps: true } )
export class User extends Document {

	@Expose()
	get id(): string {
		return this._id.toString();
	}

	@Transform((value) => value.toString(), { toPlainOnly: true })
	_id: Types.ObjectId;

	@Prop()
	name: string;

	@Prop( { type: Date } )
	dob: Date;

	@Prop()
	address: string;

	@Prop()
	description: string;

	// ID & TimeStamps are set Automatically and Match the Required Schema Names
}


export const UserSchema = SchemaFactory.createForClass( User );
