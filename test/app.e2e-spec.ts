import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CustomErrorFilter } from '../src/presentation/rest/custom.error.filter';
import { UserEntity } from '../src/infrastructure/postgres/user/user.entity';
import { FriendEntity } from '../src/infrastructure/postgres/friend/friend.entity';

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

    await FriendEntity.destroy({ where: {} });
    await UserEntity.destroy({ where: {} });
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

  it('Add user with wrong address - expect error', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ name: 'Philip J. Fry', address: 'Wrong address format' })
      .expect(400)
      .expect(
        '{"statusCode":400,"message":["address must be an array"],"error":"Bad Request"}',
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

  it('Add user and update user - expect user', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ name: 'Philip J. Fry' })
      .expect(201)
      .then((response) => {
        const user = response.body;
        expect(user).toHaveProperty('name', 'Philip J. Fry');
        expect(user).toHaveProperty('id');
        return request(app.getHttpServer())
          .get(`/user/${user.id}`)
          .expect(200)
          .then((response) => {
            const returnedUser = response.body;
            expect(returnedUser).toEqual(user);

            return request(app.getHttpServer())
              .patch(`/user/${user.id}`)
              .send({ dateOfBirth: '2020-04-20' })
              .expect(200)
              .then((response) => {
                return request(app.getHttpServer())
                  .get(`/user/${user.id}`)
                  .expect(200)
                  .then((response) => {
                    const updatedUser = response.body;
                    expect(updatedUser).toHaveProperty(
                      'dateOfBirth',
                      '2020-04-20',
                    );
                  });
              });
          });
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

  it('Add two user and make a friend', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ name: 'Philip J. Fry 1st' })
      .expect(201)
      .then((response) => {
        const user1 = response.body;
        return request(app.getHttpServer())
          .post('/user')
          .send({ name: 'Philip J. Fry 2nd' })
          .expect(201)
          .then((response) => {
            const user2 = response.body;
            return request(app.getHttpServer())
              .post(`/user/${user1.id}/friend/${user2.id}`)
              .expect(201)
              .then((response) => {
                expect(response.body).toHaveProperty('userId', user1.id);
                expect(response.body).toHaveProperty('otherUserId', user2.id);
              });
          });
      });
  });

  it('Add two user, make a friend and check nearby', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ name: 'Philip J. Fry 1st', address: [31.226133, 121.466505] })
      .expect(201)
      .then((response) => {
        const user1 = response.body;
        return request(app.getHttpServer())
          .post('/user')
          .send({ name: 'Philip J. Fry 2nd', address: [31.225133, 121.465505] })
          .expect(201)
          .then((response) => {
            const user2 = response.body;
            return request(app.getHttpServer())
              .post(`/user/${user1.id}/friend/${user2.id}`)
              .expect(201)
              .then((response) => {
                expect(response.body).toHaveProperty('userId', user1.id);
                expect(response.body).toHaveProperty('otherUserId', user2.id);

                return request(app.getHttpServer())
                  .get(`/user/${user1.id}/friend/nearby`)
                  .expect(200)
                  .then((response) => {
                    expect(response.body).toHaveLength(1);
                    expect(response.body[0]).toHaveProperty(
                      'distance',
                      146.18796597,
                    );
                    expect(response.body[0]).toHaveProperty('id', user2.id);
                    expect(response.body[0]).toHaveProperty('name', user2.name);
                  });
              });
          });
      });
  });
});
