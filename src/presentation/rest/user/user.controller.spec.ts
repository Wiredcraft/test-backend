import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../../application/user/user.service';
import { UserRepositoryInMemory } from '../../../infrastructure/in-memory/user/user.repository';
import { FriendService } from '../../../application/friend/friend.service';
import { FriendRepositoryInMemory } from 'src/infrastructure/in-memory/friend/friend.repository';
import { UserRepository } from '../../../domain/user/user.repository';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        FriendService,
        { provide: 'UserRepository', useClass: UserRepositoryInMemory },
        { provide: 'FriendRepository', useClass: FriendRepositoryInMemory },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Add 1 user', () => {
    it('Add 1 user - expect to have id', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      expect(createdUser).toHaveProperty('id');
    });

    it('Add 1 user - expect to find users in find all', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      expect(createdUser).toHaveProperty('id');

      const findAllUsers = await controller.findAll();
      expect(findAllUsers).toHaveLength(1);
      expect(findAllUsers[0]).toHaveProperty('id', createdUser.id);
      expect(findAllUsers[0]).toHaveProperty('name', userToCreate.name);
    });

    it('Add 1 user - get by id should return same user', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      expect(createdUser).toHaveProperty('id');

      const foundUser = await controller.findOne(createdUser.id);
      expect(foundUser).toEqual(createdUser);
    });

    it('Add 1 user - delete should remove user from get and findAll', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      expect(createdUser).toHaveProperty('id');

      let findAllUsers = await controller.findAll();
      expect(findAllUsers).toHaveLength(1);

      expect(await controller.remove(createdUser.id)).toEqual(true);
      expect(await controller.remove(createdUser.id)).toEqual(false);

      findAllUsers = await controller.findAll();
      expect(findAllUsers).toHaveLength(0);

      const foundUser = await controller.findOne(createdUser.id);
      expect(foundUser).toEqual(undefined);
    });

    it('Add 1 user - delete should remove user from get and findAll', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      expect(createdUser).toHaveProperty('id');

      let findAllUsers = await controller.findAll();
      expect(findAllUsers).toHaveLength(1);

      expect(await controller.remove(createdUser.id)).toEqual(true);
      expect(await controller.remove(createdUser.id)).toEqual(false);

      findAllUsers = await controller.findAll();
      expect(findAllUsers).toHaveLength(0);

      const foundUser = await controller.findOne(createdUser.id);
      expect(foundUser).toEqual(undefined);
    });

    it('Add 1 user with full details', async () => {
      await controller.create({
        address: [31, 121],
        dateOfBirth: new Date('1975-06-01Z'),
        description: 'Character in Futurama',
        name: 'Philip J. Fry',
      });
    });
    it('Add 1 user, try add a non existing friend, throw error', async () => {
      const createdUser = await controller.create({
        name: 'Philip J. Fry',
      });

      await expect(
        controller.createFriend(createdUser.id, 'SomeOtherId'),
      ).rejects.toThrowError('User id not found');
    });
  });

  describe('multiple users', () => {
    it('find all', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      const createdUser2 = await controller.create(userToCreate);
      expect(await controller.findAll()).toHaveLength(2);
    });

    it('delete one, should still find the other', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      const createdUser2 = await controller.create(userToCreate);
      expect(await controller.findAll()).toHaveLength(2);
      await controller.remove(createdUser.id);
      expect(await controller.findAll()).toHaveLength(1);
      expect((await controller.findAll())[0]).toHaveProperty(
        'id',
        createdUser2.id,
      );
    });

    it('add friend, should retrieve friends', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      const createdUser2 = await controller.create(userToCreate);
      await controller.createFriend(createdUser.id, createdUser2.id);
      expect(await controller.getFriends(createdUser.id)).toHaveLength(1);
    });

    it('add friend, supply offset, should retrieve empty friends', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      const createdUser2 = await controller.create(userToCreate);
      await controller.createFriend(createdUser.id, createdUser2.id);
      expect(await controller.getFriends(createdUser.id, 1)).toHaveLength(0);
    });

    it('remove friend, should retrieve empty friends', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      const createdUser2 = await controller.create(userToCreate);
      await controller.createFriend(createdUser.id, createdUser2.id);
      expect(await controller.getFriends(createdUser.id)).toHaveLength(1);
      await controller.removeFriend(createdUser.id, createdUser2.id);
      expect(await controller.getFriends(createdUser.id)).toHaveLength(0);
    });
  });

  describe('no user', () => {
    it('get by id should return undefined', async () => {
      expect(await controller.findOne('SomeId')).toEqual(undefined);
    });

    it('find all should return empty list', async () => {
      expect(await controller.findAll()).toEqual([]);
    });

    it('delete should return false', async () => {
      expect(await controller.remove('SomeId')).toEqual(false);
    });

    it('add friend, should throw error that user does not exist', async () => {
      await expect(
        controller.createFriend('SomeId', 'SomeOtherId'),
      ).rejects.toThrowError('User id not found');
    });
  });
});
