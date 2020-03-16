import {TokenService, UserService} from '@loopback/authentication';
import {DefaultHasOneRepository, HasOneRepository} from '@loopback/repository';
import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import sinon from 'sinon';
import {UserController} from '../../../controllers';
import {User, UserCredentials} from '../../../models';
import {Credentials, UserRepository} from '../../../repositories';
import {
  givenUser,
  givenUserCredentials,
  givenUserInstance,
} from '../../helpers/database.helpers';

describe('UserController (unit)', () => {
  let userRepository: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userCredentialsRepository: StubbedInstanceWithSinonAccessor<HasOneRepository<
    UserCredentials
  >>;
  let userCredentialsStub: sinon.SinonStub;
  let jwtService: TokenService;
  let userService: UserService<User, Credentials>;
  let userRepositoryCreate: sinon.SinonStub;
  let userCredentialsRepositoryCreate: sinon.SinonStub;
  let userCredentialsRepositoryPatch: sinon.SinonStub;
  const userId = 'a3db1b15-fd23-4bbe-8f1e-104b1c714a0a';

  beforeEach(function() {
    stubRepository();
    stubTokenService();
    stubUserService();
  });

  describe('create()', () => {
    it('should create an new user when the user is no exists', async () => {
      const findStub = userRepository.findOne as sinon.SinonStub;
      findStub.resolves();

      const user = givenUser({id: userId});
      const userCredentials = givenUserCredentials();
      userRepositoryCreate.resolves(user);
      userCredentialsRepositoryCreate.resolves(userCredentials);
      const controller = initUserController();
      const newUser = await controller.create(
        Object.assign({
          ...user,
          ...userCredentials,
        }),
      );
      expect(newUser.deleted).to.be.eql(false);
      expect(newUser.name).to.be.eql(user.name);
    });

    it('should throw conflict error when user is exists', async () => {
      const user = givenUser({id: userId});
      const userCredentials = givenUserCredentials();
      const findStub = userRepository.findOne as sinon.SinonStub;
      findStub.resolves(user);
      try {
        const controller = initUserController();
        await controller.create(
          Object.assign({
            ...user,
            ...userCredentials,
          }),
        );
      } catch (error) {
        expect(error).match(/The user is already exists/);
      }
    });

    it('should upsert when the user is exists but has been deleted', async () => {
      const user = givenUser({id: userId, deleted: true});
      const findStub = userRepository.findOne as sinon.SinonStub;
      findStub.resolves(user);
      const replaceByIdStub = userRepository.replaceById as sinon.SinonStub;
      replaceByIdStub.resolves();
      userCredentialsRepositoryPatch.resolves();
      const newUserAddress = 'user-new-address';
      const controller = initUserController();
      const newUser = await controller.create(
        Object.assign({
          ...user,
          password: 'user-password',
          address: newUserAddress,
        }),
      );
      expect(newUser.deleted).to.be.eql(false);
      expect(newUser.address).to.be.eql(newUserAddress);
    });
  });

  describe('isExist()', () => {
    it('should return true if user is valid and deleted is false', async () => {
      userRepositoryCreate.resolves(givenUser());
      const user = await givenUserInstance(userRepository);
      const controller = initUserController();
      const isExist = controller.isExist(user);
      expect(isExist).to.be.eql(true);
    });

    it('should return false if user is valid and deleted is true', async () => {
      userRepositoryCreate.resolves(givenUser({deleted: true}));
      const user = await givenUserInstance(userRepository);
      const controller = initUserController();
      const isExist = controller.isExist(user);
      expect(isExist).to.be.eql(false);
    });

    it('should return false if user is null', () => {
      const controller = initUserController();
      const isExist = controller.isExist(null);
      expect(isExist).to.be.eql(false);
    });
  });

  function stubTokenService() {
    jwtService = {verifyToken: sinon.stub(), generateToken: sinon.stub()};
  }

  function stubUserService() {
    userService = {
      verifyCredentials: sinon.stub(),
      convertToUserProfile: sinon.stub(),
    };
  }

  function stubRepository() {
    userRepository = createStubInstance(UserRepository);
    userRepositoryCreate = userRepository.stubs.create;

    userCredentialsRepository = createStubInstance<
      HasOneRepository<UserCredentials>
    >(DefaultHasOneRepository);
    userCredentialsStub = sinon.stub();
    userCredentialsStub.withArgs(userId).returns(userCredentialsRepository);
    userCredentialsRepositoryCreate = userCredentialsRepository.stubs.create;
    userCredentialsRepositoryPatch = userCredentialsRepository.stubs.patch;

    // eslint-disable-next-line
    (userRepository as any).userCredentials = userCredentialsStub;
  }

  function initUserController() {
    return new UserController(userRepository, jwtService, userService);
  }
});
