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

describe('UserController (e2e)', async () => {
  let app: INestApplication;
  let userService: UserService;
  let redisService: RedisService;
  let userGeoService: UserGeoService;
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

  const testUser = genMockUser();

  const testGeoInfo = {
    latitude: 1,
    longitude: 1,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    userService = moduleRef.get<UserService>(UserService);
    redisService = moduleRef.get<RedisService>(RedisService);
    connection = moduleRef.get(getConnectionToken());
    userGeoService = moduleRef.get<UserGeoService>(UserGeoService);

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

  it('should POST /user', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(testUser)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.id).not.toBeNull();
        createId = body.payload.id;
      });
  });

  it('should GET /user/:id', () => {
    return request(app.getHttpServer())
      .get('/user/' + createId)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.payload.id).toEqual(createId);
      });
  });

  it('should GET /user/qwdqwd (error userId)', () => {
    return request(app.getHttpServer())
      .get('/user/qwdqwd')
      .expect(HttpStatus.BAD_REQUEST)
      .then(({ body }: { body: ErrorResponse<any> }) => {
        expect(body.code).toEqual(ErrorCode.ParamError);
      });
  });

  it('should GET /user/6058de8411d1f27e8ccf63e3 (not exist user)', () => {
    return request(app.getHttpServer())
      .get('/user/6058de8411d1f27e8ccf63e3')
      .expect(HttpStatus.NOT_FOUND)
      .then(({ body }: { body: ErrorResponse<any> }) => {
        expect(body.code).toEqual(ErrorCode.ResourceNotExist);
      });
  });

  it('should POST /user (duplicate username)', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({
        ...genMockUser(),
        name: testUser.name,
      })
      .expect(HttpStatus.BAD_REQUEST)
      .then(({ body }: { body: ErrorResponse<any> }) => {
        expect(body.code).toEqual(ErrorCode.ResourceNotExist);
      });
  });

  it('should PATCH /user/:id', async () => {
    const newInfo = genMockUser();
    const { body } = await request(app.getHttpServer())
      .patch('/user/' + createId)
      .send(newInfo)
      .expect(HttpStatus.OK);
    expect(body.code).toEqual(ErrorCode.OK);

    const infoRes = await request(app.getHttpServer())
      .get('/user/' + createId)
      .expect(HttpStatus.OK);
    expect(infoRes.body.code).toEqual(ErrorCode.OK);
    expect(infoRes.body.payload.name).toEqual(newInfo.name);
    expect(infoRes.body.payload.description).toEqual(newInfo.description);
    expect(infoRes.body.payload.address).toEqual(newInfo.address);
    expect(new Date(infoRes.body.payload.dob).toString()).toEqual(
      newInfo.dob.toString(),
    );
  });

  it('should PATCH /user/:id (Error dob format)', () => {
    return request(app.getHttpServer())
      .patch('/user/' + createId)
      .send({
        ...genMockUser(),
        dob: '113',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .then(({ body }: { body: ErrorResponse<any> }) => {
        expect(body.code).toEqual(ErrorCode.ParamError);
      });
  });

  it('should PATCH /user/:id/geo', () => {
    return request(app.getHttpServer())
      .patch('/user/' + createId + '/geo')
      .send(testGeoInfo)
      .expect(HttpStatus.OK)
      .then(({ body }: { body: BaseResponse }) => {
        expect(body.code).toEqual(ErrorCode.OK);
      });
  });

  it('should GET /user/:id/geo', () => {
    return request(app.getHttpServer())
      .get('/user/' + createId + '/geo')
      .expect(HttpStatus.OK)
      .then(({ body }: { body: GetUserGeoInfoResponse }) => {
        expect(body.code).toEqual(ErrorCode.OK);
        expect(body.payload.latitude).toEqual(testGeoInfo.latitude);
        expect(body.payload.longitude).toEqual(testGeoInfo.longitude);
      });
  });

  it('should POST /user/:id/geo (invalid latitude, longitude)', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/user/' + createId + '/geo')
      .send({
        latitude: 9999999,
        longitude: 999999,
      })
      .expect(HttpStatus.BAD_REQUEST);
    expect(body.code).toEqual(ErrorCode.ParamError);
    const infoRes = await request(app.getHttpServer())
      .get('/user/' + createId + '/geo')
      .expect(HttpStatus.OK);
    expect(infoRes.body.code).toEqual(ErrorCode.OK);
    expect(infoRes.body.payload.latitude).toEqual(testGeoInfo.latitude);
    expect(infoRes.body.payload.longitude).toEqual(testGeoInfo.longitude);
  });

  it('should GET /user/:id/nearby', async () => {
    const UserA = await userService.createUser(genMockUser());
    const UserB = await userService.createUser(genMockUser());
    const UserC = await userService.createUser(genMockUser());
    const UserD = await userService.createUser(genMockUser());

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

    const resA = await request(app.getHttpServer())
      .get('/user/' + UserA.id + '/nearby')
      .expect(HttpStatus.OK);

    expect(resA.body.payload.length).toEqual(0);

    await userGeoService.updateUserGeoInfo(UserD.id, {
      latitude: 22,
      longitude: 33.003,
    });

    const resB = await request(app.getHttpServer())
      .get('/user/' + UserA.id + '/nearby')
      .expect(HttpStatus.OK);
    expect(resB.body.payload.length).toEqual(1);
    expect(resB.body.payload[0].id).toEqual(UserD.id);
  });
});
