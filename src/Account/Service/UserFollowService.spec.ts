import UserService from './UserService';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../AppModule';
import BusinessError from '../../Common/BusinessError';
import { ErrorCode } from '../../ErrorCode';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { RedisService } from 'nestjs-redis';
import RedisKeys from '../../Common/RedisKeys';
import { Connection, Model } from 'mongoose';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import UserGeoService from './UserGeoService';
import UserFollowService from './UserFollowService';
import { UserFollow, UserFollowSchema } from '../Schema/UserFollowSchema';

describe('UserService', () => {
  let app: INestApplication;
  let userService: UserService;
  let userFollowService: UserFollowService;
  let redisService: RedisService;
  let connection: Connection;
  let userAId, userBId;
  let followModal: Model<UserFollow>;

  const genMokeUser = () => {
    return {
      name: 'testYser:' + randomBytes(5).toString('hex'),
      dob: '12-12-2018',
      description: randomBytes(10).toString('hex'),
      address: randomBytes(10).toString('hex'),
    };
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    userService = moduleRef.get<UserService>(UserService);
    userFollowService = moduleRef.get<UserFollowService>(UserFollowService);
    redisService = moduleRef.get<RedisService>(RedisService);
    connection = moduleRef.get(getConnectionToken());

    followModal = moduleRef.get(getModelToken(UserFollow.name));

    userAId = (await userService.createUser(genMokeUser())).id;
    userBId = (await userService.createUser(genMokeUser())).id;
  });

  afterAll(async () => {
    await redisService.getClient().flushdb();
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  describe('UserFollowService', () => {
    it('follow', async () => {
      await userFollowService.follow(userAId, userBId);

      expect(
        await redisService
          .getClient()
          .hmget(RedisKeys.UserCache(userAId), 'followCount'),
      ).toEqual(expect.arrayContaining(['1']));
      expect(
        await redisService
          .getClient()
          .hmget(RedisKeys.UserCache(userBId), 'fansCount'),
      ).toEqual(expect.arrayContaining(['1']));

      expect(await followModal.count({ userId: userAId })).toBe(1);
      expect(await followModal.count({ targetId: userBId })).toBe(1);
    });

    it('getFollowCount', async () => {
      expect(await userFollowService.getFollowCount(userAId)).toBe(1);
    });

    it('GetFansCount', async () => {
      expect(await userFollowService.getFansCount(userBId)).toBe(1);
    });

    it('GetFansList', async () => {
      const fans = await userFollowService.getFansList(userBId, 0, 10);
      expect(fans.length).toBe(1);
      expect(fans[0]).toBe(userAId);
    });
    it('GetFollowList', async () => {
      const follow = await userFollowService.getFollowList(userAId, 0, 10);
      expect(follow.length).toBe(1);
      expect(follow[0]).toBe(userBId);
    });

    it('unfollow', async () => {
      await userFollowService.unFollow(userAId, userBId);
      expect(await userFollowService.getFollowCount(userAId)).toBe(0);
      expect(await userFollowService.getFansCount(userBId)).toBe(0);
    });

    it('unfollowAll', async () => {
      const userA = await userService.createUser(genMokeUser());
      const userB = await userService.createUser(genMokeUser());
      const userC = await userService.createUser(genMokeUser());

      await userFollowService.follow(userA.id, userB.id);
      await userFollowService.follow(userA.id, userC.id);

      expect(await userFollowService.getFollowCount(userA.id)).toBe(2);
      expect(await userFollowService.getFansCount(userB.id)).toBe(1);
      expect(await userFollowService.getFansCount(userC.id)).toBe(1);
      await userFollowService.unFollowAll(userA.id);
      expect(await userFollowService.getFollowCount(userA.id)).toBe(0);
      expect(await userFollowService.getFansCount(userB.id)).toBe(0);
      expect(await userFollowService.getFansCount(userC.id)).toBe(0);
    });
  });
});
