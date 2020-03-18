import {DefaultHasOneRepository, HasOneRepository} from '@loopback/repository';
import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import sinon from 'sinon';
import {UserCredentials} from '../../../models';
import {UserRepository} from '../../../repositories';
import {givenUser} from '../../helpers/database.helpers';
import {BcryptHasher} from './../../../services/password-service';
import {MyUserService} from './../../../services/user-service';

describe('MyUserService (unit)', () => {
  let userRepository: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userCredentialsRepository: StubbedInstanceWithSinonAccessor<HasOneRepository<
    UserCredentials
  >>;
  let userCredentialsStub: sinon.SinonStub;
  let userService: MyUserService;
  const userId = 'a3db1b15-fd23-4bbe-8f1e-104b1c714a0a';

  beforeEach(function() {
    stubRepository();
    userService = new MyUserService(userRepository, new BcryptHasher(10));
  });

  describe('verifyCredentials()', () => {
    it('should throw error if fail to find user', async () => {
      (userRepository.findOne as sinon.SinonStub).resolves(undefined);
      try {
        // eslint-disable-next-line
        await userService.verifyCredentials({} as any);
      } catch (err) {
        expect(err).match(/Invalid name or password/);
      }
    });

    it('should throw error if fail to find credentials', async () => {
      const user = givenUser({id: userId});
      (userRepository.findOne as sinon.SinonStub).resolves(user);
      (userRepository.findCredentials as sinon.SinonStub).resolves(undefined);
      try {
        // eslint-disable-next-line
        await userService.verifyCredentials({} as any);
      } catch (err) {
        expect(err).match(/Invalid name or password/);
      }
    });

    it('should throw error if fail to match password', async () => {
      const user = givenUser({id: userId});
      (userRepository.findOne as sinon.SinonStub).resolves(user);
      (userRepository.findCredentials as sinon.SinonStub).resolves(
        Object.assign({}, user, {password: 'password'}),
      );
      try {
        // eslint-disable-next-line
        await userService.verifyCredentials({password: 'test'} as any);
      } catch (err) {
        expect(err).match(/Invalid name or password/);
      }
    });
  });

  describe('convertToUserProfile()', () => {});

  function stubRepository() {
    userRepository = createStubInstance(UserRepository);

    userCredentialsRepository = createStubInstance<
      HasOneRepository<UserCredentials>
    >(DefaultHasOneRepository);

    userCredentialsStub = sinon.stub();
    userCredentialsStub.withArgs(userId).returns(userCredentialsRepository);

    // eslint-disable-next-line
    (userRepository as any).userCredentials = userCredentialsStub;
  }
});
