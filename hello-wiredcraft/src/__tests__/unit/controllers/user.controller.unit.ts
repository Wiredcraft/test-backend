import {TokenService, UserService} from '@loopback/authentication';
import {DefaultHasOneRepository, HasOneRepository} from '@loopback/repository';
import {securityId} from '@loopback/security';
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
  let findOneUserStub: sinon.SinonStub;
  let findUserByIdStub: sinon.SinonStub;
  let userController: UserController;
  const userId = 'a3db1b15-fd23-4bbe-8f1e-104b1c714a0a';

  beforeEach(function() {
    stubRepository();
    stubTokenService();
    stubUserService();
    stepupUserController();
  });

  describe('create()', () => {
    it('should create an new user when the user is no exists', async () => {
      const user = givenUser({id: userId});
      const userCredentials = givenUserCredentials();
      findOneUserStub.resolves();
      userRepositoryCreate.resolves(user);
      userCredentialsRepositoryCreate.resolves(userCredentials);
      const newUser = await userController.create(
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
      findOneUserStub.resolves(user);
      try {
        await userController.create(
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
      findOneUserStub.resolves(user);
      const replaceByIdStub = userRepository.replaceById as sinon.SinonStub;
      replaceByIdStub.resolves();
      userCredentialsRepositoryPatch.resolves();
      const newUserAddress = 'user-new-address';
      const newUser = await userController.create(
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

  describe('findById()', () => {
    it('should return user find by userId', async () => {
      const user = givenUser({id: userId});
      findOneUserStub.resolves(user);
      const findUser = await userController.findById(userId);
      expect(findUser).not.to.be.null();
      expect(findUser!.name).to.be.eql(user.name);
      expect(findUser!.address).to.be.eql(user.address);
    });
  });

  describe('replaceById()', () => {
    it('should throw error if replace a deleted user', async () => {
      const user = givenUser({id: userId, deleted: true});
      findUserByIdStub.resolves(user);
      try {
        await userController.replaceById(
          userId,
          Object.assign({
            ...user,
          }),
        );
      } catch (error) {
        expect(error).match(/The user id is not exists/);
      }
    });

    it('should replace the exist user with the new one', async () => {
      const replaceByIdStub = userRepository.replaceById as sinon.SinonStub;
      const user = givenUser({id: userId});
      findUserByIdStub.resolves(user);
      await userController.replaceById(
        userId,
        Object.assign({
          ...user,
        }),
      );
      expect(replaceByIdStub.calledOnce).to.be.true();
    });
  });

  describe('deleteById()', () => {
    it('should throw error if delete a deleted user', async () => {
      const user = givenUser({id: userId, deleted: true});
      findUserByIdStub.resolves(user);
      try {
        await userController.deleteById(userId);
      } catch (error) {
        expect(error).match(/The user id is not exists/);
      }
    });

    it('should delete the exist user', async () => {
      const replaceByIdStub = userRepository.replaceById as sinon.SinonStub;
      const user = givenUser({id: userId});
      findUserByIdStub.resolves(user);
      await userController.deleteById(userId);
      expect(replaceByIdStub.calledOnce).to.be.true();
    });
  });

  describe('login()', () => {
    it('should verify the credentials and return the JWT token', async () => {
      const user = givenUser({id: userId});
      (userService.verifyCredentials as sinon.SinonStub).resolves(user);
      (userService.convertToUserProfile as sinon.SinonStub).returns({
        [securityId]: user.id,
        id: user.id,
        name: user.name,
      });
      (jwtService.generateToken as sinon.SinonStub).resolves('accepted');
      const {token} = await userController.login({
        name: 'name',
        password: 'password',
      });
      expect(token).to.be.eql('accepted');
    });
  });

  describe('getCurrentUser()', () => {
    it('should return current user profile', async () => {
      const user = givenUser({id: userId});
      const userProfile = {
        [securityId]: user.id,
        id: user.id,
        name: user.name,
      };
      const returnUserProfile = await userController.getCurrentUser(
        Object.assign({
          ...userProfile,
        }),
      );
      expect(returnUserProfile.id).to.be.eql(userProfile.id);
      expect(returnUserProfile.name).to.be.eql(userProfile.name);
    });
  });

  describe('isExist()', () => {
    it('should return true if user is valid and deleted is false', async () => {
      userRepositoryCreate.resolves(givenUser());
      const user = await givenUserInstance(userRepository);
      const isExist = userController.isExist(user);
      expect(isExist).to.be.eql(true);
    });

    it('should return false if user is valid and deleted is true', async () => {
      userRepositoryCreate.resolves(givenUser({deleted: true}));
      const user = await givenUserInstance(userRepository);
      const isExist = userController.isExist(user);
      expect(isExist).to.be.eql(false);
    });

    it('should return false if user is null', () => {
      const isExist = userController.isExist(null);
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

    findOneUserStub = userRepository.findOne as sinon.SinonStub;
    findUserByIdStub = userRepository.findById as sinon.SinonStub;
  }

  function stepupUserController() {
    userController = new UserController(
      userRepository,
      jwtService,
      userService,
    );
  }
});
