import { Logger } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { Connection } from "mongoose";
import { ConfigModule } from "../../config/config.module";
import { ConfigService } from "../../config/config.service";
import { User, UserSchema } from "../user/user.model";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import MongoTestModule, { closeMongoConnection } from "../../config/mongo-test.config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

describe( "AuthService", () => {

	let service: AuthService;
	let connection: Connection;

	beforeAll( async () => {

		const module: TestingModule = await Test.createTestingModule( {
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
				} ),
				MongoTestModule( {
					connectionName: ( new Date().getTime() * Math.random() ).toString( 16 )
				} ),
				MongooseModule.forFeature( [ { name: User.name, schema: UserSchema } ] )
			],
			providers: [ AuthService, Logger, LocalStrategy, JwtStrategy ]
		} ).compile();

		service = module.get<AuthService>( AuthService );
		connection = await module.get( getConnectionToken() );
	} );

	afterAll( async () => {
		await connection.close();
		await closeMongoConnection();
	} );

	it( "should be defined", () => {
		expect( service ).toBeDefined();
	} );

} );
