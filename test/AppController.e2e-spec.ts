import { HttpStatus, INestApplication } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Connection } from 'mongoose';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/AppModule';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';

describe('AppController (e2e)', async () => {
  let app: INestApplication;
  let redisService: RedisService;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    redisService = moduleRef.get<RedisService>(RedisService);
    connection = moduleRef.get(getConnectionToken());
    await app.init();
  });

  afterAll(async () => {
    await redisService.getClient().flushdb();
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  it('should Get /sys/ping', () => {
    return request(app.getHttpServer())
      .get('/sys/ping')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.ts).not.toBeNull();
      });
  });
});
