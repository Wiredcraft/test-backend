import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CustomErrorFilter } from '../src/presentation/rest/custom.error.filter';
import { UserEntity } from '../src/infrastructure/postgres/user/user.entity';
import { FriendEntity } from '../src/infrastructure/postgres/friend/friend.entity';
import {
  CreateUserDtoPresentation,
  UpdateUserDtoPresentation,
} from '../src/presentation/rest/user/user.types';
import { FriendRepositoryPostgres } from 'src/infrastructure/postgres/friend/friend.repository';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new CustomErrorFilter());
    await app.init();

    await FriendEntity.destroy({ where: {} });
    await UserEntity.destroy({ where: {} });
  });

  async function createUser(value: CreateUserDtoPresentation) {
    return request(app.getHttpServer())
      .post('/user')
      .send(value)
      .expect(201)
      .then((response) => {
        return response.body;
      });
  }

  async function getUser(userId: string, responseCode = 200) {
    return request(app.getHttpServer())
      .get(`/user/${userId}`)
      .expect(responseCode)
      .then((response) => {
        return response.body;
      });
  }

  async function getUsers() {
    return request(app.getHttpServer())
      .get(`/user`)
      .expect(200)
      .then((response) => {
        return response.body;
      });
  }

  async function deleteUser(userId: string) {
    return request(app.getHttpServer())
      .delete(`/user/${userId}`)
      .expect(200)
      .then((response) => {
        return response.body;
      });
  }

  async function updateUser(userId: string, body: UpdateUserDtoPresentation) {
    return request(app.getHttpServer())
      .patch(`/user/${userId}`)
      .send(body)
      .expect(200)
      .then((response) => {
        return response.body;
      });
  }

  async function createFriend(
    userId: string,
    userOtherId: string,
    responseCode = 201,
  ) {
    return request(app.getHttpServer())
      .post(`/user/${userId}/friend/${userOtherId}`)
      .expect(responseCode)
      .then((response) => {
        if (responseCode === 201) {
          const userIds = FriendRepositoryPostgres.getOrderedUserIds({
            userId,
            otherUserId: userOtherId,
          });
          expect(response.body).toHaveProperty('userId', userIds.userId);
          expect(response.body).toHaveProperty(
            'otherUserId',
            userIds.otherUserId,
          );
          return response.body;
        }
      });
  }

  async function getFriendsNearby(
    userId: string,
    offset: number = 0,
    limit: number = 10,
  ) {
    return request(app.getHttpServer())
      .get(`/user/${userId}/friend/nearby?offset=${offset}&limit=${limit}`)
      .expect(200)
      .then((response) => {
        return response.body;
      });
  }

  async function getFriends(
    userId: string,
    offset: number = 0,
    limit: number = 10,
  ) {
    return request(app.getHttpServer())
      .get(`/user/${userId}/friend?offset=${offset}&limit=${limit}`)
      .expect(200)
      .then((response) => {
        return response.body;
      });
  }

  describe('Add user', function () {
    it('Add empty user - throw error', () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({ abc: 'abc' })
        .expect(400)
        .expect(
          '{"statusCode":400,"message":["property abc should not exist","name must be a string"],"error":"Bad Request"}',
        );
    });

    it('Add user with wrong address - expect error', () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({ name: 'Philip J. Fry', address: 'Wrong address format' })
        .expect(400)
        .expect(
          '{"statusCode":400,"message":["address must be an array"],"error":"Bad Request"}',
        );
    });

    it('Add user - expect user', async () => {
      const user = await createUser({
        name: 'Philip J. Fry 1st',
      });
      expect(user).toHaveProperty('name', 'Philip J. Fry 1st');
      expect(user).toHaveProperty('id');
    });
  });

  describe('List user', () => {
    it('Add user - list user and find one', async () => {
      let listUsers = await getUsers();
      expect(listUsers).toHaveLength(0);

      const user = await createUser({
        name: 'Philip J. Fry 1st',
      });

      listUsers = await getUsers();
      expect(listUsers).toHaveLength(1);
      expect(listUsers[0]).toHaveProperty('name', 'Philip J. Fry 1st');
      expect(listUsers[0]).toHaveProperty('id', user.id);
    });

    it('Add user - list user and find one', async () => {
      let listUsers = await getUsers();
      expect(listUsers).toHaveLength(0);

      const user = await createUser({
        name: 'Philip J. Fry 1st',
      });

      listUsers = await getUsers();
      expect(listUsers).toHaveLength(1);
      expect(listUsers[0]).toHaveProperty('name', 'Philip J. Fry 1st');
      expect(listUsers[0]).toHaveProperty('id', user.id);
    });
  });

  it('Add user and delete user - expect user deleted', async () => {
    const user = await createUser({
      name: 'Philip J. Fry 1st',
    });

    let returnedUser = await getUser(user.id);
    expect(returnedUser).toEqual(user);
    await deleteUser(user.id);

    await getUser(user.id, 404);
  });

  it('Add user and update user - expect user', async () => {
    const user = await createUser({
      name: 'Philip J. Fry 1st',
    });

    let returnedUser = await getUser(user.id);
    expect(returnedUser).toEqual(user);

    await updateUser(user.id, { dateOfBirth: ('2020-04-20' as any) as Date });
    returnedUser = await getUser(user.id);
    expect(returnedUser).toHaveProperty('dateOfBirth', '2020-04-20');
  });

  it('Add friend with non existing users - throw error', () => {
    return request(app.getHttpServer())
      .post('/user/SomeId/friend/SomeOtherId')
      .expect(404)
      .then((response) => {
        expect(response.body).toHaveProperty('message', 'User not found');
      });
  });

  it('Add two user and make a friend, should find friend for both', async () => {
    const user = await createUser({
      name: 'Philip J. Fry 1st',
    });

    const user2 = await createUser({
      name: 'Philip J. Fry 2nd',
    });

    let friends = await getFriends(user.id);
    expect(friends).toHaveLength(0);

    await createFriend(user.id, user2.id);
    friends = await getFriends(user.id);
    expect(friends).toHaveLength(1);
    const userIds = FriendRepositoryPostgres.getOrderedUserIds({
      userId: user.id,
      otherUserId: user2.id,
    });

    expect(friends[0]).toHaveProperty('userId', userIds.userId);
    expect(friends[0]).toHaveProperty('otherUserId', userIds.otherUserId);

    friends = await getFriends(user2.id);
    expect(friends).toHaveLength(1);
    expect(friends[0]).toHaveProperty('userId', userIds.userId);
    expect(friends[0]).toHaveProperty('otherUserId', userIds.otherUserId);
  });

  it('Add two user and make a friend, use offset of 1, should not find any friends', async () => {
    const user = await createUser({
      name: 'Philip J. Fry 1st',
    });

    const user2 = await createUser({
      name: 'Philip J. Fry 2nd',
    });

    let friends = await getFriends(user.id);
    expect(friends).toHaveLength(0);

    await createFriend(user.id, user2.id);
    friends = await getFriends(user.id, 1);
    expect(friends).toHaveLength(0);
  });

  it('Add three users and make 2 different friends', async () => {
    const user = await createUser({
      name: 'Philip J. Fry 1st',
    });

    const user2 = await createUser({
      name: 'Philip J. Fry 2nd',
    });

    const user3 = await createUser({
      name: 'Philip J. Fry 3nd',
    });

    let friends = await getFriends(user.id);
    expect(friends).toHaveLength(0);

    friends = await getFriends(user.id);
    expect(friends).toHaveLength(0);

    await createFriend(user.id, user2.id);
    await createFriend(user.id, user3.id);
    friends = await getFriends(user.id);
    expect(friends).toHaveLength(2);

    friends = await getFriends(user2.id);
    expect(friends).toHaveLength(1);
    expect(friends[0].userId.indexOf([user.id, user2.id]) >= 0);
    expect(friends[0].otherUserId.indexOf([user.id, user2.id]) >= 0);

    friends = await getFriends(user3.id);
    expect(friends).toHaveLength(1);
    expect(friends[0].userId.indexOf([user.id, user3.id]) >= 0);
    expect(friends[0].otherUserId.indexOf([user.id, user3.id]) >= 0);
  });

  it('Add two users as friends, without address, do not find nearby', async () => {
    const user = await createUser({
      name: 'Philip J. Fry 1st',
    });

    const user2 = await createUser({
      name: 'Philip J. Fry 2nd',
    });

    const friend = await createFriend(user.id, user2.id);
    const friendsNearby = await getFriendsNearby(user.id);
    expect(friendsNearby).toHaveLength(0);
  });

  it('Add two users twice as friends, should throw conflict error', async () => {
    const user = await createUser({
      name: 'Philip J. Fry 1st',
    });

    const user2 = await createUser({
      name: 'Philip J. Fry 2nd',
    });

    await createFriend(user.id, user2.id);
    await createFriend(user.id, user2.id, 409);
  });
  it('Add two user, make a friend and check nearby', async () => {
    const user = await createUser({
      name: 'Philip J. Fry 1st',
      address: [31.226133, 121.466505],
    });

    const user2 = await createUser({
      name: 'Philip J. Fry 2nd',
      address: [31.225133, 121.465505],
    });

    const friend = await createFriend(user.id, user2.id);
    let friendsNearby = await getFriendsNearby(user.id);
    expect(friendsNearby).toHaveLength(1);
    expect(friendsNearby[0]).toHaveProperty('distance', 146.18796597);
    expect(friendsNearby[0]).toHaveProperty('id', user2.id);
    expect(friendsNearby[0]).toHaveProperty('name', user2.name);
    expect(friendsNearby[0]).toHaveProperty('address', user2.address);

    friendsNearby = await getFriendsNearby(user2.id);
    expect(friendsNearby).toHaveLength(1);
    expect(friendsNearby[0]).toHaveProperty('distance', 146.18796597);
    expect(friendsNearby[0]).toHaveProperty('id', user.id);
    expect(friendsNearby[0]).toHaveProperty('name', user.name);
    expect(friendsNearby[0]).toHaveProperty('address', user.address);
  });
});
