import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { getConnectionToken, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Connection } from "mongoose";
import { AppModule } from "../src/app.module";
import { User } from "../src/modules/user/user.model";
import * as request from "supertest";
import { getRegisterUserDto } from "./util/register-user.mock";
import * as faker from "faker";


describe( "LoginController (e2e)", () => {
	let app: INestApplication;
	let connection: Connection;

	beforeAll( async () => {
		// Bootstrap Application
		const moduleFixture = await Test.createTestingModule( {
			imports: [ AppModule ]
		} ).compile();

		app = moduleFixture.createNestApplication();

		// Replicate filters and pipes used in main application
		app.useGlobalPipes( new ValidationPipe( { whitelist: true, transform: true } ) );

		connection = moduleFixture.get( getConnectionToken() );

		await app.init();
	} );

	beforeEach( async () => {
		await connection.collection( getModelToken( User.name ) ).deleteMany( {} );
	} );

	afterAll( async () => {
		await connection.dropDatabase();
		await connection.close();
		await app.close();
	} );


	it( "should POST /auth/login for a given user", async () => {
		const registerRequest = getRegisterUserDto();
		await request( app.getHttpServer() )
			.post( "/auth/register" )
			.send( registerRequest )
			.expect( HttpStatus.CREATED );

		return request( app.getHttpServer() )
			.post( "/auth/login" )
			.send( { email: registerRequest.email, password: registerRequest.password } )
			.expect( HttpStatus.CREATED )
			.then( ( { body } ) => {
				expect( body.access_token ).toBeTruthy();
			} );

	} );

	it( "should FAIL to POST /auth/login if credentials are wrong", async () => {
		await request( app.getHttpServer() )
			.post( "/auth/register" )
			.send( getRegisterUserDto() )
			.expect( HttpStatus.CREATED );

		return request( app.getHttpServer() )
			.post( "/auth/login" )
			.send( { email: faker.internet.email(), password: faker.random.word() } )
			.expect( HttpStatus.UNAUTHORIZED );
	} );
} );
