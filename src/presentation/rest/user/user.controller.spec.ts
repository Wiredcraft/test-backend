import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../../application/user/user.service';
import { UserRepositoryInMemory } from '../../../infrastructure/in-memory/user/user.repository';
import { FriendService } from '../../../application/friend/friend.service';
import { FriendRepositoryInMemory } from 'src/infrastructure/in-memory/friend/friend.repository';
import { UserRepository } from '../../../domain/user/user.repository';
import { HttpException } from '@nestjs/common';

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

    it('Add 1 user and update', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      expect(createdUser).toHaveProperty('id');
      expect(
        await controller.update(createdUser.id, {
          description: 'Some description',
        }),
      ).toEqual(true);
      const foundUser = await controller.findOne(createdUser.id);
      expect(foundUser).toHaveProperty('description', 'Some description');
      expect(foundUser).toHaveProperty('id', createdUser.id);
      expect(foundUser).toHaveProperty('address', undefined);
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
      await expect(controller.remove(createdUser.id)).rejects.toThrowError(
        new HttpException('User not found', 404),
      );

      findAllUsers = await controller.findAll();
      expect(findAllUsers).toHaveLength(0);

      await expect(controller.findOne(createdUser.id)).rejects.toThrowError(
        new HttpException('User not found', 404),
      );
    });

    it('Add 1 user with full details', async () => {
      const user = await controller.create({
        address: [31, 121] as any,
        dateOfBirth: new Date('1975-06-01Z'),
        description: 'Character in Futurama',
        name: 'Philip J. Fry',
      });
      expect(user).toHaveProperty('id');
      const foundUser = await controller.findOne(user.id);
      expect(foundUser).toHaveProperty('address', user.address);
      expect(foundUser).toHaveProperty('dateOfBirth', user.dateOfBirth);
      expect(foundUser).toHaveProperty('description', user.description);
      expect(foundUser).toHaveProperty('name', user.name);
    });
    it('Add 1 user, try add a non existing friend, throw error', async () => {
      const createdUser = await controller.create({
        name: 'Philip J. Fry',
      });

      await expect(
        controller.createFriend(createdUser.id, 'SomeOtherId'),
      ).rejects.toThrowError(new HttpException('User not found', 404));
    });
  });

  describe('multiple users', () => {
    it('create 2 - find all', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      const createdUser2 = await controller.create(userToCreate);
      expect(await controller.findAll()).toHaveLength(2);
    });

    it('create 2 - offset 1 - find one', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      const createdUser2 = await controller.create(userToCreate);
      const result = await controller.findAll(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', createdUser2.id);
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

    it('add friend and remove friend, should retrieve 0 friends', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      const createdUser2 = await controller.create(userToCreate);
      await controller.createFriend(createdUser.id, createdUser2.id);
      expect(await controller.getFriends(createdUser.id)).toHaveLength(1);
      await controller.removeFriend(createdUser.id, createdUser2.id);
      expect(await controller.getFriends(createdUser.id)).toHaveLength(0);
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

    it('remove non-existing friend, should throw error', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      const createdUser2 = await controller.create(userToCreate);
      expect(await controller.getFriends(createdUser.id)).toHaveLength(0);
      await expect(
        controller.removeFriend(createdUser.id, createdUser2.id),
      ).rejects.toThrowError(new HttpException('Friend not found', 404));
      expect(await controller.getFriends(createdUser.id)).toHaveLength(0);
    });
  });

  describe('no user', () => {
    it('get by id should return 404', async () => {
      await expect(controller.findOne('SomeId')).rejects.toThrowError(
        new HttpException('User not found', 404),
      );
    });

    it('Update non-existing user - return 404', async () => {
      const userToCreate = { name: 'Wiredcraft unit test' };
      const createdUser = await controller.create(userToCreate);
      expect(createdUser).toHaveProperty('id');
      expect(
        await controller.update(createdUser.id, {
          description: 'Some description',
        }),
      ).toEqual(true);
      const foundUser = await controller.findOne(createdUser.id);
      expect(foundUser).toHaveProperty('description', 'Some description');
      expect(foundUser).toHaveProperty('id', createdUser.id);
      expect(foundUser).toHaveProperty('address', undefined);
    });

    it('find all should return empty list', async () => {
      expect(await controller.findAll()).toEqual([]);
    });

    it('delete should return false', async () => {
      await expect(controller.remove('SomeId')).rejects.toThrowError(
        new HttpException('User not found', 404),
      );
    });

    it('add friend, should throw error that user does not exist', async () => {
      await expect(
        controller.createFriend('SomeId', 'SomeOtherId'),
      ).rejects.toThrowError(new HttpException('User not found', 404));
    });

    it('remove friend, should throw error that user does not exist', async () => {
      await expect(
        controller.removeFriend('SomeId', 'SomeOtherId'),
      ).rejects.toThrowError(new HttpException('User not found', 404));
    });

    it('get friends, should throw error that user does not exist', async () => {
      await expect(controller.getFriends('SomeId')).rejects.toThrowError(
        new HttpException('User not found', 404),
      );
    });

    it('get friends nearby, should throw error that user does not exist', async () => {
      await expect(controller.getFriendsInRange('SomeId')).rejects.toThrowError(
        new HttpException('User not found', 404),
      );
    });
  });
});
