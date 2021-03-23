import UserService from './UserService';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../AppModule';
import BusinessError from '../../Common/BusinessError';
import { ErrorCode } from '../../ErrorCode';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { RedisService } from 'nestjs-redis';
import RedisKeys from '../../Common/RedisKeys';
import * as moment from 'moment';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let app: INestApplication;
  let userService: UserService;
  let redisService: RedisService;
  let connection: Connection;
  let createId;

  const genMockUser = () => {
    return {
      name: 'testYser:' + randomBytes(5).toString('hex'),
      dob: new Date(),
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
    redisService = moduleRef.get<RedisService>(RedisService);
    connection = moduleRef.get(getConnectionToken());
  });

  afterAll(async () => {
    await redisService.getClient().flushdb();
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  const testUser = genMockUser();

  describe('UserService', () => {
    it('should return id', async () => {
      const result = await userService.createUser(testUser);

      expect(result.id).not.toBe(null);
      createId = result.id;
    });

    it('throw ResourceExist', async () => {
      try {
        await userService.createUser(testUser);
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessError);
        expect(e.code).toBe(ErrorCode.ResourceExist);
        expect(e.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('has user cache', async () => {
      expect(
        await redisService.getClient().exists(RedisKeys.UserCache(createId)),
      ).toBe(1);
    });

    it('find user', async () => {
      const user = await userService.getUserWithId(createId);
      expect(user.name).toBe(testUser.name);
      expect(user.description).toBe(testUser.description);
      expect(user.address).toBe(testUser.address);
    });

    it('update user', async () => {
      const newInfo = genMockUser();
      await userService.updateUser(createId, newInfo);
      const user = await userService.getUserWithId(createId);
      expect(user.name).toBe(newInfo.name);
      expect(user.description).toBe(newInfo.description);
      expect(user.address).toBe(newInfo.address);
    });

    it('delete user & check unknown user', async () => {
      try {
        await userService.deleteUserWithId(createId);
        await userService.getUserWithId(createId);
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessError);
        expect(e.code).toBe(ErrorCode.ResourceNotExist);
        expect(e.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
