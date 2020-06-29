import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "./config.module";
import { ConfigService } from "./config.service";

describe( "ConfigService", () => {
	let configService: ConfigService;

	beforeAll( async () => {
		const module: TestingModule = await Test.createTestingModule( {
			imports: [ ConfigModule ],
			providers: [
				{
					provide: ConfigService,
					useValue: ".env.example"
				}
			]
		} ).compile();
		configService = module.get<ConfigService>( ConfigService );
	} );

	it( "should be defined", () => {
		expect( configService ).toBeDefined();
	} );

	it( "should register an app name", () => {
		expect( configService.appName ).toBeTruthy();
	} );

	it( "should register a valid node env", () => {
		expect( [ "test", "development", "staging", "production" ] ).toContain( configService.nodeEnv );
	} );

	it( "should register a port number", () => {
		expect( configService.appPort ).toBeDefined();
		expect( configService.appPort ).toBeGreaterThan( 0 );
	} );

	it( "should register a mongodb URL", () => {
		expect( configService.mongoUri ).toContain( "mongodb" );
	} );

	it( "should register an app name", () => {
		expect( configService.mongoTestingUri ).toContain( "mongodb" );
	} );

	it( "should register a jwt key", () => {
		expect( configService.jwtKey ).toBeTruthy();
	} );
} );
