import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { getConnectionToken, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Connection } from "mongoose";
import { AppModule } from "../src/app.module";
import { RegisterRequest } from "../src/modules/auth/requests/register.request";
import { User } from "../src/modules/user/user.model";
import * as request from "supertest";
import { getRegisterUserDto } from "./util/register-user.mock";
import * as faker from "faker";


describe( "RegisterController (e2e)", () => {
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


	it( "should POST /auth/register and register a user", () => {

		return request( app.getHttpServer() )
			.post( "/auth/register" )
			.send( getRegisterUserDto() )
			.expect( HttpStatus.CREATED )
			.then( ( { body } ) => {
				expect( body.access_token ).toBeTruthy();
			} );

	} );

	it( "should FAIL to POST /auth/register if passwords do not match", () => {
		const registerDto: RegisterRequest = {
			name: faker.name.firstName(), email: faker.internet.email(), dob: faker.date.past(), address: faker.address.streetAddress(),
			password: faker.internet.password( 7 ), passwordConfirmation: faker.internet.password( 8 ), description: faker.random.words()
		};
		return request( app.getHttpServer() )
			.post( "/auth/register" )
			.send( registerDto )
			.expect( HttpStatus.BAD_REQUEST );
	} );
} );
