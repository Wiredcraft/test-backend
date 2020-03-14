import {User} from '../../models';
import {UserCredentialsRepository, UserRepository} from '../../repositories';
import {testDB} from '../fixtures/datasources/testdb.datasource';

export function givenUserData(data?: Partial<User>) {
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

export async function givenUser(data?: Partial<User>) {
  const userCredentialsRepository = new UserCredentialsRepository(testDB);
  return new UserRepository(
    testDB,
    async () => userCredentialsRepository,
  ).create(givenUserData(data));
}
