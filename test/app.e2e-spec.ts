import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { random } from 'lodash';
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userName = 'test' + random(1, 999999);
  let password = 'test' + random(1, 99999);
  let userId: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/v1/users/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ userName, password })
      .expect(201);
  });

  it('/api/v1/users/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({ username: userName, password: 'test' })
      .expect(201);
  });

  it('/api/v1/users (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/v1/users')
      .expect(200);
    userId = body[0]._id
  });
  
  it('/api/v1/users/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/api/v1/users/${userId}`)
      .expect(200);
  });
});
