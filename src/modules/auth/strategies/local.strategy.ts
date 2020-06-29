import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "../../user/user.model";
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy( Strategy ) {
	constructor( private readonly auth: AuthService ) {
		super( {
			usernameField: "email",
			passwordField: "password"
		} );
	}

	public async validate( email: string, password: string ): Promise<User> {
		const user = await this.auth.validateUser( email, password );
		if ( !user ) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
