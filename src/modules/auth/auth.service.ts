import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";
import * as argon from "argon2";
import { RegisterUserDto } from "./dtos/register-user.dto";


@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		@Inject( Logger ) private readonly logger: Logger
	) {
	}

	public async validateUser( email: string, password: string ): Promise<User> {
		const user = await this.userService.findByEmail( email );
		if ( user?.password && await argon.verify( user.password, password ) ) {
			return user;
		}
		return null;
	}

	public async login( user: User ) {
		const payload = { email: user.email, sub: user.id };
		return {
			access_token: this.jwtService.sign( payload )
		};
	}

	public async register( request: RegisterUserDto ) {
		const userExists = await this.userService.findByEmail( request.email );

		if ( userExists ) {
			throw new BadRequestException( "Hey, it looks like you are already registered, try signing in!" );
		}

		try {
			const user = await this.userService.create( request );
			return this.login( user );
		} catch ( e ) {
			this.logger.error( "auth.registration.failed", e, AuthService.name );

			if ( e instanceof BadRequestException ) {
				throw new BadRequestException( e.message );
			} else {
				throw new InternalServerErrorException( "User Registration Failed! Try Again Later" );
			}
		}

	}
}
