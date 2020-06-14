import { IsISO8601, IsNotEmpty, IsString } from "class-validator";


export class CreateUserRequest {

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	address: string;

	@IsNotEmpty()
	@IsString()
	description: string;

	@IsNotEmpty()
	@IsISO8601()
	dob: Date;

}
