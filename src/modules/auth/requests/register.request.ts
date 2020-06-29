import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { CreateUserRequest } from "../../user/dtos/requests/create-user.request";

export class RegisterRequest extends CreateUserRequest {

	@IsNotEmpty()
	@MinLength( 6 )
	@ApiProperty( {
		minimum: 6
	} )
	readonly password: string;

	@IsNotEmpty()
	@MinLength( 6 )
	@ApiProperty( {
		minimum: 6
	} )
	readonly passwordConfirmation: string;


}
