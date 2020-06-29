import * as faker from "faker";
import { CreateUserRequest } from "../../src/modules/user/dtos/requests/create-user.request";

export function getCreateUserDto(): CreateUserRequest {
	return {
		name: faker.internet.userName(),
		address: faker.address.streetAddress(),
		dob: faker.date.past( 18 ),
		description: faker.random.words(),
		email: faker.internet.email()
	};
}
