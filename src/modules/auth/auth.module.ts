import { Logger, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { RegisterController } from "./register.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { LoginController } from "./login.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "../../config/config.service";
import { ConfigModule } from "../../config/config.module";


@Module( {
	imports: [
		UserModule,
		PassportModule.register( { defaultStrategy: "jwt" } ),
		JwtModule.registerAsync( {
			imports: [ ConfigModule ],
			useFactory: async ( config: ConfigService ) => ( {
				secret: config.jwtKey,
				signOptions: { expiresIn: "12h" }
			} ),
			inject: [ ConfigService ]
		} )
	],
	providers: [ AuthService, LocalStrategy, JwtStrategy, Logger ],
	controllers: [ LoginController, RegisterController ]
} )
export class AuthModule {
}
