import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {givenUser} from '../../helpers/database.helpers';
import {UserController} from './../../../controllers/user.controller';
import {UserRepository} from './../../../repositories/user.repository';

describe('UserController (unit)', () => {
  let repository: StubbedInstanceWithSinonAccessor<UserRepository>;
  beforeEach(function() {
    repository = createStubInstance(UserRepository);
  });

  describe('create()', () => {
    it('should create an new user when the user is no exists', async () => {
      const findStub = repository.findOne as sinon.SinonStub;
      findStub.resolves();
      const user = await givenUser();
      const createStub = repository.create as sinon.SinonStub;
      createStub.resolves(user);

      const controller = new UserController(repository);
      const newUser = await controller.create(
        Object.assign({
          ...user,
          password: 'user-password',
        }),
      );
      expect(newUser.deleted).to.be.eql(false);
      expect(newUser.name).to.be.eql(user.name);
    });

    it('should throw conflict error when user is exists', async () => {
      const user = await givenUser();
      const findStub = repository.findOne as sinon.SinonStub;
      findStub.resolves(user);
      try {
        const controller = new UserController(repository);
        await controller.create(
          Object.assign({
            ...user,
            password: 'user-password',
          }),
        );
      } catch (error) {
        expect(error).match(/The user is already exists/);
      }
    });

    it('should upsert when the user is exists but has been deleted', async () => {
      const user = await givenUser({deleted: true});
      const findStub = repository.findOne as sinon.SinonStub;
      findStub.resolves(user);
      const replaceByIdStub = repository.replaceById as sinon.SinonStub;
      replaceByIdStub.resolves();
      const newUserAddress = 'user-new-address';
      const controller = new UserController(repository);
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
      const user = await givenUser();
      const controller = new UserController(repository);
      const isExist = controller.isExist(user);
      expect(isExist).to.be.eql(true);
    });

    it('should return false if user is valid and deleted is true', async () => {
      const user = await givenUser({deleted: true});
      const controller = new UserController(repository);
      const isExist = controller.isExist(user);
      expect(isExist).to.be.eql(false);
    });

    it('should return false if user is null', () => {
      const controller = new UserController(repository);
      const isExist = controller.isExist(null);
      expect(isExist).to.be.eql(false);
    });
  });
});
