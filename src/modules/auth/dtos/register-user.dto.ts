import { IsNotEmpty, MinLength } from "class-validator";
import { CreateUserRequest } from "../../user/dtos/requests/create-user.request";

export class RegisterUserDto extends CreateUserRequest {

	@IsNotEmpty()
	@MinLength( 6 )
	readonly password: string;

	@IsNotEmpty()
	@MinLength( 6 )
	readonly passwordConfirmation: string;


}
