import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Connection } from "mongoose";
import { CreateUserRequest } from "./dtos/requests/create-user.request";
import { User, UserSchema } from "./user.model";
import { UserService } from "./user.service";
import MongoTestModule, { closeMongoConnection } from "../../config/mongo-test.config";
import * as faker from "faker";

function getTestUser(): CreateUserRequest {
	return {
		name: faker.internet.userName(),
		address: faker.address.streetAddress(),
		dob: faker.date.past( 18 ),
		description: faker.random.words(),
		email: faker.internet.email()
	}
}
describe( "UserService", () => {

	let service: UserService;
	let connection: Connection;

	beforeAll( async () => {

		const module: TestingModule = await Test.createTestingModule( {
			imports: [
				MongoTestModule( {
					connectionName: ( new Date().getTime() * Math.random() ).toString( 16 )
				} ),
				MongooseModule.forFeature( [ { name: User.name, schema: UserSchema } ] )
			],
			providers: [ UserService ]
		} ).compile();

		service = module.get<UserService>( UserService );
		connection = await module.get( getConnectionToken() );
	} );

	afterAll( async () => {
		await connection.close();
		await closeMongoConnection();
	} );

	it( "should be defined", () => {
		expect( service ).toBeDefined();
	} );

	it( "should find retrieve all users", async () => {
		expect( await service.find() ).toHaveLength( 0 );
	} );

	it( "should store user information", async () => {
		expect( await service.create( getTestUser() ) ).toBeTruthy();
	} );

	it( "should retrieve one user information", async () => {

		const testUserRequest = getTestUser();
		const testUser = await service.create( testUserRequest );

		const user = await service.findByIdOrFail( testUser._id.toString() );
		expect( user.name ).toStrictEqual( testUserRequest.name );
		expect( user.address ).toStrictEqual( testUserRequest.address );
		expect( user.dob ).toStrictEqual( testUserRequest.dob );
		expect( user.createdAt ).toBeTruthy();
		expect( user.updatedAt ).toBeTruthy();
		expect( user._id ).toStrictEqual( testUser._id );
	} );

	it( "should delete a user", async () => {
		const testUser = await service.create( getTestUser() );
		await service.findByIdAndDelete( testUser.id );
		expect( await service.findById( testUser.id ) ).toBeFalsy();
	} );

	it( "should update a users details", async () => {
		const testUser = await service.create( getTestUser() );
		const description = faker.random.words();
		await service.findByIdAndUpdate( testUser.id, { description } );
		const updatedUser = await service.findById( testUser.id );
		expect( updatedUser.description ).toStrictEqual( description );
	} );
} );
