import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dtos/register-user.dto";


@Controller( "auth" )
export class RegisterController {

	constructor( private readonly authService: AuthService ) {}

	@Post( "register" )
	async register( @Body() request: RegisterUserDto ) {
		if ( request.passwordConfirmation !== request.password ) {
			throw new BadRequestException( "Passwords don't match!" );
		}
		return await this.authService.register( request );
	}

}
