import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema( { timestamps: true } )
export class User extends Document {

	//  _id & Timestamps are created with the help of mongoose Schema options and as such do not need @Prop annotations
	_id: Types.ObjectId;

	@Prop( { required: true } )
	name: string;

	@Prop( { type: Date, required: true } )
	dob: Date;

	@Prop( { required: true } )
	address: string;

	@Prop()
	description: string;

	createdAt: Date;

	updatedAt: Date;

	public static toResource( resource: User ) {
		return {
			id: resource._id.toString(),
			name: resource.name,
			dob: resource.dob,
			address: resource.address,
			description: resource.description,
			createdAt: resource.createdAt
		};
	}

	public static toCollection( resources: User[] ) {
		return resources.map( ( resource ) => User.toResource( resource ) );
	}
}


export const UserSchema = SchemaFactory.createForClass( User );
