import * as faker from "faker";
import { RegisterUserDto } from "../../src/modules/auth/dtos/register-user.dto";

export function getRegisterUserDto(): RegisterUserDto {
	const password = faker.internet.password( 7 );
	return {
		name: faker.name.firstName(),
		address: faker.address.streetAddress(),
		dob: faker.date.past( 18 ),
		description: faker.random.words(),
		email: faker.internet.email( faker.name.firstName(), faker.name.lastName() ),
		password,
		passwordConfirmation: password
	};
}
