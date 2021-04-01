import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { User, UserAppService } from '../application/user.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { OnMemoryUserRepository } from '../infra/on-memory/user.repository';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserAppService,
        {
          provide: UserRepository,
          useClass: OnMemoryUserRepository,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    const repository = app.get<UserRepository>(UserRepository);
    repository.deleteAll();
  });

  describe('root', () => {
    it('should return empty list', async () => {
      const list = Array.from(await userController.listUser({}));
      expect(list.length).toBe(0);
    });

    it('should return a list after we create a user', async () => {
      const created = await userController.createUser({
        name: 'Name',
        dob: new Date(),
        address: '',
        description: '',
        createdAt: new Date(),
      });

      const list = await userController.listUser({});
      expect(list.length).toBe(1);
      expect(list[0]).toEqual(created);
    });
  });

  describe('findUser', () => {
    it('should return 404 by default', async () => {
      await expect(() => userController.findUser('foo')).rejects.toThrow(
        new HttpException(
          'No user found with user ID foo',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
    it('should return a user after we create a user', async () => {
      const created = await userController.createUser({
        name: 'Name',
        dob: new Date(),
        address: '',
        description: '',
        createdAt: new Date(),
      });
      const found = await userController.findUser(created.id);
      expect(found).toEqual(created);
    });
  });
});

class BrokenRepository extends UserRepository {
  list(): Promise<User[]> {
    throw new Error('emulated by BrokenRepository.');
  }
  create(): Promise<void> {
    throw new Error('emulated by BrokenRepository.');
  }
  update(): Promise<void> {
    throw new Error('emulated by BrokenRepository.');
  }
  load(): Promise<User> {
    throw new Error('emulated by BrokenRepository.');
  }
  delete(): Promise<void> {
    throw new Error('emulated by BrokenRepository.');
  }
  deleteAll(): Promise<void> {
    return Promise.resolve(void 0);
  }
}

describe('UserController with broken repository', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserAppService,
        {
          provide: UserRepository,
          useClass: BrokenRepository,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    const repository = app.get<UserRepository>(UserRepository);
    repository.deleteAll();
  });

  describe('listUser', () => {
    it('rejects with error', async () => {
      expect(userController.listUser({})).rejects.toThrow();
    });
  });

  describe('findUser', () => {
    it('rejects with error', async () => {
      expect(userController.findUser('id')).rejects.toThrow();
    });
  });

  describe('createUser', () => {
    it('rejects with error', async () => {
      expect(
        userController.createUser({
          name: 'Name',
          dob: new Date(),
          address: '',
          description: '',
          createdAt: new Date(),
        }),
      ).rejects.toThrow();
    });
  });

  describe('updateUser', () => {
    it('rejects with error', async () => {
      expect(
        userController.updateUser('id', {
          name: 'Name',
          dob: new Date(),
          address: '',
          description: '',
          createdAt: new Date(),
        }),
      ).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('rejects with error', async () => {
      expect(userController.deleteUser('id')).rejects.toThrow();
    });
  });
});
