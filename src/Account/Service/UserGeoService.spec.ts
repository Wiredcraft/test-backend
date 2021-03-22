import UserService from './UserService';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../AppModule';
import BusinessError from '../../Common/BusinessError';
import { ErrorCode } from '../../ErrorCode';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { RedisService } from 'nestjs-redis';
import RedisKeys from '../../Common/RedisKeys';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import UserGeoService from './UserGeoService';

describe('UserService', () => {
  let app: INestApplication;
  let userService: UserService;
  let userGeoService: UserGeoService;
  let redisService: RedisService;
  let connection: Connection;
  let createId;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    userService = moduleRef.get<UserService>(UserService);
    userGeoService = moduleRef.get<UserGeoService>(UserGeoService);
    redisService = moduleRef.get<RedisService>(RedisService);
    connection = moduleRef.get(getConnectionToken());
  });

  afterAll(async () => {
    await redisService.getClient().flushdb();
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  const genMokeUser = () => {
    return {
      name: 'testYser:' + randomBytes(5).toString('hex'),
      dob: '12-12-2018',
      description: randomBytes(10).toString('hex'),
      address: randomBytes(10).toString('hex'),
    };
  };

  const testUser = genMokeUser();

  const testGeo = {
    latitude: 66,
    longitude: 33,
  };

  describe('UserGeoService', () => {
    it('update geo', async () => {
      const user = await userService.createUser(testUser);
      createId = user.id;
      await userGeoService.updateUserGeoInfo(createId, testGeo);
      const res = await userGeoService.getGeoInfoWithId(createId);

      expect(res.latitude).toBe(testGeo.latitude);
      expect(res.longitude).toBe(testGeo.longitude);
    });

    it('check geo cache', async () => {
      const userCache = await redisService
        .getClient()
        .hmget(RedisKeys.UserCache(createId), 'longitude', 'latitude');

      expect(userCache.length).toBe(2);
      expect(parseFloat(userCache[0])).toBe(testGeo.longitude);
      expect(parseFloat(userCache[1])).toBe(testGeo.latitude);
    });

    it('delete geo cache', async () => {
      await userGeoService.deleteGeoInfo(createId);
      const geohash = await redisService
        .getClient()
        .zscore(RedisKeys.UserGeoRange(), createId);
      expect(geohash).toBe(null);
    });

    it('get NearByUser', async () => {
      const UserA = await userService.createUser(genMokeUser());
      const UserB = await userService.createUser(genMokeUser());
      const UserC = await userService.createUser(genMokeUser());

      await userGeoService.updateUserGeoInfo(UserA.id, {
        latitude: 22,
        longitude: 33,
      });

      await userGeoService.updateUserGeoInfo(UserB.id, {
        latitude: 22,
        longitude: 33.2,
      });

      await userGeoService.updateUserGeoInfo(UserC.id, {
        latitude: 33,
        longitude: 22,
      });

      const resA = await userGeoService.getNearByUser(UserA.id, 1, 20);
      expect(resA.length).toBe(0);

      const resB = await userGeoService.getNearByUser(UserA.id, 200, 20);
      expect(resB.length).toBe(1);
    });
  });
});
