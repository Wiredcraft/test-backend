import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { random } from 'lodash';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { setGlobalApplicationContext } from '../src/util/deps';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let username = 'test' + random(1, 999999);
  let password = 'test' + random(1, 99999);
  let moduleFixture: TestingModule;
  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    setGlobalApplicationContext(app);
  });

  afterEach(async () => {
    await moduleFixture
      .get<Connection>(getConnectionToken())
      .collections.users.drop();
  });

  it('/api/v1/users/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);
  });

  it('/api/v1/users/login (POST)', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);
    return request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({ username: username, password })
      .expect(200);
  });

  it('/api/v1/users/login (POST) with Unauthorized error', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);
    const { body } = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({ username: username, password: 'test' })
      .expect(401);
    expect(body.message.error).toBe('Unauthorized');
    expect(body.statusCode).toBe(401);
  });

  it('/api/v1/users (GET)', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);
    const { body } = await request(app.getHttpServer())
      .get('/api/v1/users')
      .expect(200);

    expect(body.length).toBe(1);

    expect(body[0].username).not.toBeUndefined();
  });

  it('/api/v1/users/:id (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);
    const { body: gotBody } = await request(app.getHttpServer())
      .get(`/api/v1/users/${body._id}`)
      .expect(200);

    expect(body._id).toBe(gotBody._id);
    expect(body.username).toBe(gotBody.username);
  });

  it('/api/v1/users/:id (Put)', async () => {
    const dob = new Date().toISOString();
    const { body } = await request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);
    const { body: tokenBody } = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({ username: username, password })
      .expect(200);
    await request(app.getHttpServer())
      .put(`/api/v1/users/${body._id}`)
      .set('Authorization', `${tokenBody.token}`)
      .send({ name: 'test', dob, address: 'test', description: 'test' })
      .expect(200);
    const { body: gotBody } = await request(app.getHttpServer())
      .get(`/api/v1/users/${body._id}`)
      .expect(200);

    expect(body._id).toBe(gotBody._id);
    expect(gotBody.name).toBe('test');
    expect(gotBody.dob).toBe(dob);

    expect(gotBody.address).toBe('test');
    expect(gotBody.description).toBe('test');
  });

  it('/api/v1/users/:id (Put) with forbidden error', async () => {
    const dob = new Date().toISOString();
    const { body } = await request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);

    const { body: errorBody } = await request(app.getHttpServer())
      .put(`/api/v1/users/${body._id}`)
      .send({ name: 'test', dob, address: 'test', description: 'test' })
      .expect(403);

      expect(errorBody.message.error).toBe('Forbidden');
  });

  it('/api/v1/users/:id (Put) with not found error', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);
    const { body: tokenBody } = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({ username: username, password })
      .expect(200);
    const { body: errorBody } = await request(app.getHttpServer())
      .put(`/api/v1/users/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', `${tokenBody.token}`)
      .send({ name: 'test', dob: new Date().toISOString(), address: 'test', description: 'test' })
      .expect(404);

    expect(errorBody.message.error).toBe('Not Found');
  });

  it('/api/v1/users/:id (Delete)', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);
    const { body: tokenBody } = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({ username: username, password })
      .expect(200);
    await request(app.getHttpServer())
      .del(`/api/v1/users/${body._id}`)
      .set('Authorization', `${tokenBody.token}`)
      .expect(200);
  });

  it('/api/v1/users/:id (Delete) with forbidden error', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);
    const { body: errorBody } =await request(app.getHttpServer())
      .del(`/api/v1/users/${body._id}`)
      .expect(403);
    expect(errorBody.message.error).toBe('Forbidden');

  });

  it('/api/v1/users/:id (Delete) with not found error', async () => {
    const dob = new Date().toISOString();
    const { body } = await request(app.getHttpServer())
      .post('/api/v1/users/register')
      .send({ username, password })
      .expect(201);

    const { body: tokenBody } = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({ username: username, password })
      .expect(200);
    const { body: errorBody } = await request(app.getHttpServer())
      .del(`/api/v1/users/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', `${tokenBody.token}`)
      .expect(404);

    expect(errorBody.message.error).toBe('Not Found');
  });
});
