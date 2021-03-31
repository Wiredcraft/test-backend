import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserAppService } from '../application/user.service';
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

  describe('/:id', () => {
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
