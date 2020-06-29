import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterRequest } from "./requests/register.request";


@Controller( "auth" )
@ApiTags( "Auth" )
export class RegisterController {

	constructor( private readonly authService: AuthService ) {}

	@Post( "register" )
	async register( @Body() request: RegisterRequest ) {
		if ( request.passwordConfirmation !== request.password ) {
			throw new BadRequestException( "Passwords don't match!" );
		}
		return await this.authService.register( request );
	}

}
