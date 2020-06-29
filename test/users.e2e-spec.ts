import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as faker from "faker";
import { getCreateUserDto } from "./util/create-user";
import { getRegisterUserDto } from "./util/register-user.mock";

describe( "UserController (e2e)", () => {
	let app: INestApplication;
	let connection: Connection;
	let authToken: string;

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

		const { body: authUser } = await request( app.getHttpServer() )
			.post( "/auth/register" )
			.send( getRegisterUserDto() )
			.expect( HttpStatus.CREATED );
		authToken = authUser.access_token;
	} );

	afterAll( async () => {
		await connection.dropDatabase();
		await connection.close();
		await app.close();
	} );


	it( "should GET /users", async () => {

		return request( app.getHttpServer() )
			.get( "/users" )
			.set( "Authorization", `Bearer ${ authToken }` )
			.expect( HttpStatus.OK )
			.then( ( { body } ) => {
				expect( body.length ).toBeGreaterThan( 0 );
			} );
	} );

	it( "should FAIL to GET /users if unauthorized", function () {
		return request( app.getHttpServer() )
			.get( "/users" )
			.expect( HttpStatus.UNAUTHORIZED );
	} );

	it( "should POST /users", async () => {
		const testUserRequest = getCreateUserDto();

		return request( app.getHttpServer() )
			.post( "/users" )
			.set( "Authorization", `Bearer ${ authToken }` )
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
			.set( "Authorization", `Bearer ${ authToken }` )
			.send( { name: faker.name } )
			.expect( HttpStatus.BAD_REQUEST );
	} );

	it( "should PATCH /users/:id", async () => {

		const { body: user } = await request( app.getHttpServer() )
			.post( "/users" )
			.set( "Authorization", `Bearer ${ authToken }` )
			.send( getCreateUserDto() )
			.expect( HttpStatus.CREATED );

		const name = faker.name.firstName();
		return request( app.getHttpServer() )
			.patch( `/users/${ user.id }` )
			.send( { name } )
			.set( "Authorization", `Bearer ${ authToken }` )
			.expect( HttpStatus.OK )
			.then( ( { body } ) => {
				expect( body.name ).toStrictEqual( name );
				expect( body.id ).toStrictEqual( user.id );
				expect( new Date( body.createdAt ).getTime() ).toBeLessThan( new Date( body.updatedAt ).getTime() );
			} );
	} );

	it( "should FAIL to POST /users if data is missing", async () => {

		const { body: user } = await request( app.getHttpServer() )
			.post( "/users" )
			.send( getCreateUserDto() )
			.set( "Authorization", `Bearer ${ authToken }` )
			.expect( HttpStatus.CREATED );

		return request( app.getHttpServer() )
			.patch( `/users/${ user.id }` )
			.set( "Authorization", `Bearer ${ authToken }` )
			.send( { dob: "20" } )
			.expect( HttpStatus.BAD_REQUEST );
	} );

	it( "should DELETE /users/:id", async () => {

		const { body: user } = await request( app.getHttpServer() )
			.post( "/users" )
			.send( getCreateUserDto() )
			.set( "Authorization", `Bearer ${ authToken }` )
			.expect( HttpStatus.CREATED );

		return request( app.getHttpServer() )
			.delete( `/users/${ user.id }` )
			.set( "Authorization", `Bearer ${ authToken }` )
			.expect( HttpStatus.NO_CONTENT );
	} );
} );
