process.env.NODE_ENV = "test"; // Force test environment

import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication } from "@nestjs/common";

describe( "HealtcheckController (e2e)", () => {
	let app: INestApplication;

	beforeAll( async () => {
		// Bootstrap Application
		const moduleFixture = await Test.createTestingModule( {
			imports: [ AppModule ]
		} ).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	} );

	afterAll( async () => {
		await app.close();
	} );

	it( "/healthcheck (GET)", () => {
		return request( app.getHttpServer() )
		.get( "/healthcheck" )
		.expect( 200 )
		.expect( "true" );
	} );
} );
