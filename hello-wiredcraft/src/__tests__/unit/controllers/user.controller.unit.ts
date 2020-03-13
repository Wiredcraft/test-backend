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

  describe('isExist()', () => {
    it('should return true if user is valid and deleted is false', async () => {
      const controller = new UserController(repository);
      const user = await givenUser();
      const isExist = controller.isExist(user);
      expect(isExist).to.be.eql(true);
    });

    it('should return false if user is valid and deleted is true', async () => {
      const controller = new UserController(repository);
      const user = await givenUser({deleted: true});
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
