import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, InternalServerErrorException, Logger, NotFoundException, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../shared/guards/jwt-auth.guard";
import { ValidateObjectIdPipe } from "../shared/pipes/validate-object-id.pipe";
import { CreateUserRequest } from "./dtos/requests/create-user.request";
import { UpdateUserRequest } from "./dtos/requests/update-user.request";
import { User } from "./user.model";
import { UserService } from "./user.service";


@Controller( "users" )
@ApiBearerAuth()
@ApiTags( "Users" )
@UseGuards( JwtAuthGuard )
export class UserController {

	constructor( private readonly userService: UserService, @Inject( Logger ) private readonly logger: Logger ) {
		logger.setContext( UserController.name );
	}

	@Get()
	@ApiOkResponse()
	public async index() {
		try {
			const users = await this.userService.find();
			return User.toCollection( users );
		} catch ( e ) {
			this.logger.error( "users.get-all.failed", e );
			throw new InternalServerErrorException( "Failed to get user list, Try again later!" );
		}
	}

	@Post()
	@ApiCreatedResponse()
	public async store( @Body() createUserRequest: CreateUserRequest ) {
		try {
			const user = await this.userService.create( createUserRequest );
			return User.toResource( user );
		} catch ( e ) {
			this.logger.error( "users.store.failed", e );
			throw new InternalServerErrorException( "Failed to Create a New User!" );
		}

	}

	@Get( ":id" )
	@ApiOkResponse()
	public async read( @Param( "id", ValidateObjectIdPipe ) id: string ) {
		try {
			const user = await this.userService.findByIdOrFail( id );
			return User.toResource( user );
		} catch ( e ) {
			this.logger.error( "users.get-one.failed", e );
			if ( e instanceof NotFoundException ) {
				throw new NotFoundException( e.message );
			} else {
				throw new InternalServerErrorException( `Failed to get User with ID ${ id }` );
			}
		}

	}

	@Patch( ":id" )
	@ApiOkResponse()
	public async update( @Param( "id", ValidateObjectIdPipe ) id: string, @Body() updateUserRequest: UpdateUserRequest ) {
		try {
			const user = await this.userService.findByIdAndUpdate( id, updateUserRequest );
			return User.toResource( user );
		} catch ( e ) {
			this.logger.error( "users.patch.failed", e );
			throw new InternalServerErrorException( `Failed to Update User with ID ${ id }` );
		}
	}

	@Delete( ":id" )
	@ApiNoContentResponse()
	@HttpCode( HttpStatus.NO_CONTENT )
	public async delete( @Param( "id", ValidateObjectIdPipe ) id: string ) {
		try {
			await this.userService.findByIdAndDelete( id );
		} catch ( e ) {
			this.logger.error( "users.delete.failed", e );
			throw new InternalServerErrorException( `Failed to Delete User with ID ${id}` );
		}

	}

}
