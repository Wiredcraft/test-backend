import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import UserService from '../src/Account/Service/UserService';
import { RedisService } from 'nestjs-redis';
import { Connection } from 'mongoose';
import { randomBytes } from 'crypto';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/AppModule';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { ErrorResponse } from '../src/Common/SwaggerBadRequestResponse';
import { ErrorCode } from '../src/ErrorCode';
import { ResponseInterceptor } from '../src/ResponseInterceptor';
import { ErrorCatchFilter } from '../src/ErrorCatchFilter';
import { BaseResponse } from '../src/Common/BaseResponse';
import { GetUserGeoInfoResponse } from '../src/Account/Controller/Response/UserControllerResponse';
import UserGeoService from '../src/Account/Service/UserGeoService';
import UserFollowService from '../src/Account/Service/UserFollowService';

describe('UserController (e2e)', async () => {
  let app: INestApplication;
  let userService: UserService;
  let redisService: RedisService;
  let connection: Connection;
  let userFollowService: UserFollowService;
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
    userFollowService = moduleRef.get<UserFollowService>(UserFollowService);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new ErrorCatchFilter());
    await app.init();
  });

  afterAll(async () => {
    await redisService.getClient().flushdb();
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  let UserAId = '';
  let UserBId = '';
  it('should POST /user/:id/follow', async () => {
    const UserA = await userService.createUser(genMockUser());
    const UserB = await userService.createUser(genMockUser());
    UserAId = UserA.id;
    UserBId = UserB.id;
    return request(app.getHttpServer())
      .put(`/user/${UserA.id}/follow`)
      .send({
        targetId: UserB.id,
      })
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.code).toEqual(ErrorCode.OK);
      });
  });

  it('should GET /user/:id/follow', () => {
    return request(app.getHttpServer())
      .get(`/user/${UserAId}/follow`)
      .query({
        offset: 0,
        limit: 10,
      })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.payload.count).toEqual(1);
        expect(body.payload.list.length).toEqual(1);
        expect(body.payload.list[0].id).toEqual(UserBId);
      });
  });

  it('should GET /user/:id/fans', () => {
    return request(app.getHttpServer())
      .get(`/user/${UserBId}/fans`)
      .query({
        offset: 0,
        limit: 10,
      })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.payload.count).toEqual(1);
        expect(body.payload.list.length).toEqual(1);
        expect(body.payload.list[0].id).toEqual(UserAId);
      });
  });

  it('should DELETE /user/:id/follow', async () => {
    await request(app.getHttpServer())
      .delete(`/user/${UserAId}/follow/${UserBId}`)
      .expect(HttpStatus.NO_CONTENT);
    expect(await userFollowService.getFansCount(UserBId)).toEqual(0);
    expect(await userFollowService.getFollowCount(UserAId)).toEqual(0);
  });
});
