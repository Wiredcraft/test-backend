import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { UserController } from '../src/presentation/user.controller';
import { UserModule } from '../src/application/user.module';
import { NewUser } from '../src/domain/user.interface';
import { OnMemoryUserRepository } from '../src/infra/on-memory/user.repository';
import { UserRepository } from '../src/domain/user.repository';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const user: NewUser = {
    name: 'name',
    dob: new Date(),
    address: 'address',
    description: 'description',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule, MongooseModule.forRoot('mongodb://localhost/e2e')],
      controllers: [UserController],
      providers: [
        {
          provide: UserRepository,
          useClass: OnMemoryUserRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const repository = app.get<UserRepository>(UserRepository);
    return repository.deleteAll();
  });

  afterEach(() => {
    app.close();
  });

  describe('/users (GET)', () => {
    it('returns empty list by default', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect('[]');
    });

    it('returns a user if it exists', async (done) => {
      await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201)
        .expect((res) => {
          const id = res.body.id;
          request(app.getHttpServer())
            .get('/users')
            .expect(200)
            .expect([
              {
                ...user,
                id,
                dob: '' + user.dob.toJSON(),
                createdAt: '' + user.createdAt.toJSON(),
              },
            ])
            .end(done);
        });
    });

    it('returns user in limited size', async () => {
      const responses = await Promise.all([
        request(app.getHttpServer()).post('/users').send(user).expect(201),
        request(app.getHttpServer()).post('/users').send(user).expect(201),
        request(app.getHttpServer()).post('/users').send(user).expect(201),
        request(app.getHttpServer()).post('/users').send(user).expect(201),
      ]);
      const userIds: string[] = responses.map((res) => {
        return res.body.id;
      });
      userIds.sort();

      const responseToList = await request(app.getHttpServer())
        .get('/users')
        .query({
          limit: '2',
          from: userIds[0],
        })
        .expect(200);

      const idInList: string[] = responseToList.body.map((user) => {
        return user.id;
      });
      expect(idInList).toStrictEqual([userIds[1], userIds[2]]);
    });
  });

  describe('/users/:id (GET)', () => {
    it('returns 404 if user is not created yet', () => {
      return request(app.getHttpServer()).get('/users/a').expect(404);
    });

    it('returns a user if it exists', async (done) => {
      await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201)
        .expect((res) => {
          const id = res.body.id;
          return request(app.getHttpServer())
            .get('/users')
            .expect(200)
            .expect([
              {
                ...user,
                id,
                dob: '' + user.dob.toJSON(),
                createdAt: '' + user.createdAt.toJSON(),
              },
            ])
            .end(done);
        });
    });
  });

  describe('/users/:id (PUT)', () => {
    it('returns 404 if user is not created yet', () => {
      return request(app.getHttpServer())
        .put('/users/id')
        .send(user)
        .expect(404);
    });

    it('returns 200 if it exists', async (done) => {
      await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201)
        .expect((res) => {
          const id = res.body.id;
          return request(app.getHttpServer())
            .put(`/users/${id}`)
            .send(user)
            .expect(200)
            .expect({
              ...user,
              id,
              dob: '' + user.dob.toJSON(),
              createdAt: '' + user.createdAt.toJSON(),
            })
            .end(done);
        });
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('returns 404 if user is not created yet', () => {
      return request(app.getHttpServer())
        .delete('/users/id')
        .send(user)
        .expect(404);
    });

    it('returns 200 if it exists', async (done) => {
      await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201)
        .expect((res) => {
          const id = res.body.id;
          return request(app.getHttpServer())
            .delete(`/users/${id}`)
            .send(user)
            .expect(200)
            .end(done);
        });
    });
  });
});
