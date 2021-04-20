import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CustomErrorFilter } from '../src/presentation/rest/custom.error.filter';

describe('AppController (e2e)', () => {
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
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(
        'Welcome, please check out the API documentation at <a href="/api"/>/api</a>',
      );
  });

  it('Add empty user - throw error', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ abc: 'abc' })
      .expect(400)
      .expect(
        '{"statusCode":400,"message":["property abc should not exist","name must be a string"],"error":"Bad Request"}',
      );
  });

  it('Add user - expect user', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ name: 'Philip J. Fry' })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('name', 'Philip J. Fry');
      });
  });

  it('Add friend with non existing users - throw error', () => {
    return request(app.getHttpServer())
      .post('/user/SomeId/friend/SomeOtherId')
      .expect(400)
      .then((response) => {
        expect(response.body).toHaveProperty('message', 'User not found');
      });
  });
});
