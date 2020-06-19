import { getConnectionToken, getModelToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "../src/config/config.service";
import * as faker from "faker";
import { GlobalErrorFilter } from "../src/modules/shared/filters/global-error.filter";
import { CreateUserRequest } from "../src/modules/user/dtos/requests/create-user.request";
import { User } from "../src/modules/user/user.model";

describe( "UserController (e2e)", () => {
	let app: INestApplication;
	let connection: Connection;

	const testUserRequest: CreateUserRequest = {
		name: faker.internet.userName(),
		address: faker.address.streetAddress(),
		dob: faker.date.past( 18 ),
		description: faker.random.words()
	};

	beforeAll( async () => {
		// Bootstrap Application
		const moduleFixture = await Test.createTestingModule( {
			imports: [ AppModule ]
		} ).compile();

		app = moduleFixture.createNestApplication();

		// Replicate filters and pipes used in main application
		app.useGlobalPipes( new ValidationPipe( { whitelist: true, transform: true } ) );
		app.useGlobalFilters( new GlobalErrorFilter() );

		connection = moduleFixture.get( getConnectionToken() );

		const config = app.get<ConfigService>( ConfigService );
		config.nodeEnv = "test";
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


	it( "should GET /users", () => {
		return request( app.getHttpServer() )
			.get( "/users" )
			.expect( HttpStatus.OK )
			.expect( [] );
	} );

	it( "should POST /users", () => {
		return request( app.getHttpServer() )
			.post( "/users" )
			.send( testUserRequest )
			.expect( HttpStatus.CREATED )
			.then( ( { body } ) => {
				expect( body ).toBeTruthy();
				expect( body.id ).toBeTruthy();
				expect( body.name ).toEqual( testUserRequest.name );
				expect( body.address ).toEqual( testUserRequest.address );
				expect( new Date( body.dob ) ).toEqual( testUserRequest.dob );
				expect( body.description ).toEqual( testUserRequest.description );
			} );
	} );

	it( "should FAIL to POST /users if data is missing", async () => {

		return request( app.getHttpServer() )
			.post( "/users" )
			.send( { name: faker.name } )
			.expect( HttpStatus.BAD_REQUEST );
	} );

	it( "should PATCH /users/:id", async () => {
		const { body: user } = await request( app.getHttpServer() ).post( "/users" ).send( testUserRequest ).expect( HttpStatus.CREATED );

		const name = faker.name.firstName();
		return request( app.getHttpServer() )
			.patch( `/users/${ user.id }` )
			.send( { name } )
			.expect( HttpStatus.OK )
			.then( ( { body } ) => {
				expect( body.name ).toStrictEqual( name );
				expect( body.id ).toStrictEqual( user.id );
				expect( new Date( body.createdAt ).getTime() ).toBeLessThan( new Date( body.updatedAt ).getTime() );
			} );
	} );

	it( "should FAIL to POST /users if data is missing", async () => {

		const { body: user } = await request( app.getHttpServer() ).post( "/users" ).send( testUserRequest ).expect( HttpStatus.CREATED );
		return request( app.getHttpServer() )
			.patch( `/users/${ user.id }` )
			.send( { dob: "20" } )
			.expect( HttpStatus.BAD_REQUEST );
	} );

	it( "should DELETE /users/:id", async () => {
		const { body: user } = await request( app.getHttpServer() ).post( "/users" ).send( testUserRequest ).expect( HttpStatus.CREATED );

		return request( app.getHttpServer() )
			.delete( `/users/${ user.id }` )
			.expect( HttpStatus.NO_CONTENT );
	} );
} );
