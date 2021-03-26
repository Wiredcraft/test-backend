import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { NewUser } from 'src/domain/user.interface';

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
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
