import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Logger, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../shared/guards/jwt-auth.guard";
import { ValidateObjectIdPipe } from "../shared/pipes/validate-object-id.pipe";
import { CreateUserRequest } from "./dtos/requests/create-user.request";
import { UpdateUserRequest } from "./dtos/requests/update-user.request";
import { User } from "./user.model";
import { UserService } from "./user.service";


@Controller( "users" )
@UseGuards( JwtAuthGuard )
export class UserController {

	constructor( private readonly userService: UserService, @Inject( Logger ) private readonly logger: Logger ) {
		logger.setContext( UserController.name );
	}

	@Get()
	public async index() {
		const users = await this.userService.find();
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
	public async update( @Param( "id", ValidateObjectIdPipe ) id: string, @Body() updateUserRequest: UpdateUserRequest ) {
		const user = await this.userService.findByIdAndUpdate( id, updateUserRequest );
		return User.toResource( user );
	}

	@Delete( ":id" )
	@HttpCode( HttpStatus.NO_CONTENT )
	public async delete( @Param( "id", ValidateObjectIdPipe ) id: string ) {
		await this.userService.findByIdAndDelete( id );
	}

}
