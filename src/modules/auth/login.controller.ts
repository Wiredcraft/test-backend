import { Controller, Request, Post, UseGuards, Body } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "../shared/guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { LoginRequest } from "./requests/login.request";


@Controller( "auth" )
@ApiTags( "Auth" )
export class LoginController {

	constructor( private readonly authService: AuthService ) {}

	@UseGuards( LocalAuthGuard )
	@ApiResponse( { status: 201, description: "Created" } )
	@Post( "login" )
	async login( @Request() req, @Body() request: LoginRequest ) {
		return this.authService.login( req.user );
	}
}
