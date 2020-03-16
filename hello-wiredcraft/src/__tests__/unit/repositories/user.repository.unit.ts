import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import {testDB} from '../../fixtures/datasources/testdb.datasource';

describe('UserRepository(unit)', () => {
  let userCredentialsRepository: UserCredentialsRepository;
  let userRepository: UserRepository;
  const userId = 'a3db1b15-fd23-4bbe-8f1e-104b1c714a0a';

  beforeEach(stubRepository);

  describe('findCredentials()', () => {
    it(`should return undefined if errCode is 'ENTITY_NOT_FOUND'`, async () => {
      userCredentialsRepository.find = sinon.stub();
      (userCredentialsRepository.find as sinon.SinonStub).resolves([]);
      const credentials = await userRepository.findCredentials(userId);
      expect(credentials).is.undefined();
    });

    it(`should thro error if errCode is not 'ENTITY_NOT_FOUND'`, async () => {
      userCredentialsRepository.find = sinon.stub();
      (userCredentialsRepository.find as sinon.SinonStub).throws('mockError');
      try {
        await userRepository.findCredentials(userId);
      } catch (err) {
        expect(err).match(/mockError/);
      }
    });
  });

  async function stubRepository() {
    userCredentialsRepository = new UserCredentialsRepository(testDB);
    await userCredentialsRepository.deleteAll();
    userRepository = new UserRepository(
      testDB,
      async () => userCredentialsRepository,
    );
  }
});
