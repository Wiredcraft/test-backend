import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator";


export class CreateUserRequest {

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	name: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	address: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	description: string;

	@IsNotEmpty()
	@IsDateString()
	@ApiProperty()
	dob: Date;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

}
