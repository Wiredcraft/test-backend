import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsOptional, IsString } from "class-validator";


export class UpdateUserRequest {

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	name: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	address: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	description: string;

	@IsOptional()
	@IsISO8601()
	@ApiPropertyOptional()
	dob: Date;

}
