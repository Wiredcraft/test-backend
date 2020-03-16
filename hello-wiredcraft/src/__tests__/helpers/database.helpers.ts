import {User, UserCredentials} from '../../models';
import {UserRepository} from '../../repositories';
import {UserCredentialsRepository} from './../../repositories/user-credentials.repository';

export function givenUser(data?: Partial<User>) {
  return Object.assign(
    {
      name: 'user-name',
      dob: new Date(),
      address: 'user-address',
      description: 'user-description',
      createdAt: new Date(),
      deleted: false,
    },
    data,
  );
}

export async function givenUserInstance(
  userRepository: UserRepository,
  user?: Partial<User>,
) {
  return userRepository.create(givenUser(user));
}

export function givenUserCredentials(
  userCredentials?: Partial<UserCredentials>,
) {
  return Object.assign(
    {
      password: 'p4ssw0rd',
    },
    userCredentials,
  );
}

export async function givenUserCredentialsInstance(
  userCredentialsRepository: UserCredentialsRepository,
  userCredentials?: Partial<UserCredentials>,
) {
  return userCredentialsRepository.create(
    givenUserCredentials(userCredentials),
  );
}
