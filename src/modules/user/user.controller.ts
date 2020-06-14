import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post } from "@nestjs/common";
import { ValidateObjectIdPipe } from "../shared/pipes/validate-object-id.pipe";
import { CreateUserRequest } from "./dtos/requests/create-user.request";
import { User } from "./user.model";
import { UserService } from "./user.service";


@Controller( "users" )
export class UserController {

	constructor( private readonly userService: UserService, @Inject( Logger ) private readonly logger: Logger ) {
		logger.setContext( UserController.name );
	}

	@Get()
	public async index() {
		const users = await this.userService.findOrFail();
		return User.toCollection( users );
	}

	@Post()
	public async store( @Body() createUserRequest: CreateUserRequest ) {
		const user = await this.userService.create( createUserRequest );
		return User.toResource( user );
	}

	@Get( ":id" )
	public async read( @Param( "id", ValidateObjectIdPipe ) id: string ) {
		const user = await this.userService.findByIdOrFail( id );
		return User.toResource( user );
	}

	@Patch( ":id" )
	public async update( @Param( "id", ValidateObjectIdPipe ) id: string ) {

	}

	@Delete( ":id" )
	public async delete( @Param( "id", ValidateObjectIdPipe ) id: string ) {
		await this.userService.findByIdAndDelete( id );
	}

}
