import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ValidateObjectIdPipe } from "../shared/pipes/validate-object-id.pipe";
import { CreateUserRequest } from "./dtos/requests/create-user.request";
import { User } from "./user.model";
import { UserService } from "./user.service";


@Controller( "users" )
export class UserController {

	constructor( private readonly userService: UserService ) {}

	@Get()
	public async index() {
		return this.userService.findAll();
	}

	@Post()
	public async store( @Body() createUserRequest: CreateUserRequest ): Promise<User> {
		return this.userService.create( createUserRequest );
	}

	@Get( ":id" )
	public async read( @Param( "id", ValidateObjectIdPipe ) id: string ): Promise<User> {
		return this.userService.findById( id );
	}

	@Put( ":id" )
	public async update( @Param( "id", ValidateObjectIdPipe ) id: string ) {

	}

	@Delete( ":id" )
	public async delete( @Param( "id", ValidateObjectIdPipe ) id: string ) {
		return this.userService.findByIdAndDelete( id );
	}

}
