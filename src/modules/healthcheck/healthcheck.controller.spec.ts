import { Test, TestingModule } from "@nestjs/testing";
import { HealthcheckController } from "./healthcheck.controller";

describe( "HealthcheckController", () => {
	let app: TestingModule;

	beforeAll( async () => {
		app = await Test.createTestingModule( {
			controllers: [ HealthcheckController ]
		} ).compile();
	} );

	describe( "getHealth", () => {
		it( "should return true", () => {
			const healthcheckController = app.get<HealthcheckController>( HealthcheckController );
			expect( healthcheckController.getHealth() ).toBe( true );
		} );
	} );
} );
