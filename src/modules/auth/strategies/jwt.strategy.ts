import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "../../../config/config.service";
import { User } from "../../user/user.model";
import { UserService } from "../../user/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

	constructor( private readonly config: ConfigService, private readonly userService: UserService ) {
		super( {
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.jwtKey
		} );
	}

	public async validate( payload: any ): Promise<User> {
		const user = await this.userService.findByEmail( payload.email );

		if ( !user ) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
