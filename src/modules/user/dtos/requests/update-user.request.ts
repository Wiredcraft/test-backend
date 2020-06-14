import { IsISO8601, IsOptional, IsString } from "class-validator";


export class UpdateUserRequest {

	@IsOptional()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	address: string;

	@IsOptional()
	@IsString()
	description: string;

	@IsOptional()
	@IsISO8601()
	dob: Date;

}
