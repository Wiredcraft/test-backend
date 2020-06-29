import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "../shared/repositories/abstract.repository";
import { User } from "./user.model";


@Injectable()
export class UserService extends AbstractRepository<User> {
	constructor( @InjectModel( User.name ) private userModel: Model<User> ) {
		super( userModel );
	}

	public async findByEmail( email: string ): Promise<User> {
		return this.findOne( { email } );
	}

}
