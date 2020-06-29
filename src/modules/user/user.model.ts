import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HookNextFunction, Types } from "mongoose";
import * as argon from "argon2";


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

	@Prop( { unique: true, required: true } )
	email: string;

	@Prop()
	password: string;

	createdAt: Date;

	updatedAt: Date;


	public static toResource( resource: User ) {
		return {
			id: resource._id.toString(),
			name: resource.name,
			dob: resource.dob,
			address: resource.address,
			description: resource.description,
			email: resource.email,
			createdAt: resource.createdAt,
			updatedAt: resource.updatedAt
		};
	}

	public static toCollection( resources: User[] ) {
		return resources.map( ( resource ) => User.toResource( resource ) );
	}
}

function hashPassword( next: HookNextFunction ) {
	// @ts-ignore
	const user: User = this;
	if ( user.password ) {
		argon.hash( user.password ).then( password => {
			user.password = password;
			next();
		} ).catch( err => next( err ) );
	}
	next();
}

function parseDateOfBirth( next: HookNextFunction ) {
	// @ts-ignore
	const user: User = this;
	if ( user.dob ) {
		user.dob = new Date( user.dob );
	}
	next();
}

export const UserSchema = SchemaFactory.createForClass( User ).pre( "save", hashPassword ).pre( "save", parseDateOfBirth );
