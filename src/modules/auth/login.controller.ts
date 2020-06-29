import { Controller, Request, Post, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../shared/guards/local-auth.guard";
import { AuthService } from "./auth.service";


@Controller( "auth" )
export class LoginController {

	constructor( private readonly authService: AuthService ) {}

	@UseGuards( LocalAuthGuard )
	@Post( "login" )
	async login( @Request() req ) {
		return this.authService.login( req.user );
	}
}
