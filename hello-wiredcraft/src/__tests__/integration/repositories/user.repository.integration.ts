import {expect} from '@loopback/testlab';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import {testDB} from '../../fixtures/datasources/testdb.datasource';
import {givenUser, givenUserInstance} from '../../helpers/database.helpers';

describe('UserRepository(integration)', () => {
  let userCredentialsRepository: UserCredentialsRepository;
  let userRepository: UserRepository;
  const userId = 'a3db1b15-fd23-4bbe-8f1e-104b1c714a0a';

  beforeEach(emptyDatabase);

  describe('findById(id)', () => {
    it('should return the user with id', async () => {
      const user = givenUser({id: userId});
      const userIns = await givenUserInstance(userRepository, user);
      const found = await userRepository.findById(userId);
      expect(userIns.name).to.be.eql(found.name);
    });
  });

  async function emptyDatabase() {
    userCredentialsRepository = new UserCredentialsRepository(testDB);
    await userCredentialsRepository.deleteAll();
    userRepository = new UserRepository(
      testDB,
      async () => userCredentialsRepository,
    );
    await userRepository.deleteAll();
  }
});
