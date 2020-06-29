import * as faker from "faker";
import { RegisterRequest } from "../../src/modules/auth/requests/register.request";

export function getRegisterUserDto(): RegisterRequest {
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
