import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "./../src/app.module";

describe('Users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`CREATE USER 001`, () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ id: '001', name: 'matrix', address: '上海市' })
      .expect(201);
  });

  it(`CREATE USER 002`, () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({ id: '002', name: 'matrix', address: '上海市' })
      .expect(201);
  });

  it(`GET USER 001`, () => {
    return request(app.getHttpServer())
      .get('/user/001')
      .expect(200)
  });


  it(`GET USER 002`, () => {
    return request(app.getHttpServer())
      .get('/user/002')
      .expect(200)
  });

  it(`USER 002 FOLLOW USER 001`, () => {
    return request(app.getHttpServer())
      .post('/user/follow')
      .send({ from: '002', to: '001' })
      .expect(201)
  });

  it(`USER 002 UNFOLLOW USER 001`, () => {
    return request(app.getHttpServer())
      .post('/user/unfollow')
      .send({ from: '002', to: '001' })
      .expect(201)
  });

  it(`DELETE 001 user`, () => {
    return request(app.getHttpServer())
      .delete('/user/001')
      .expect(200);
  });

  it(`DELETE 002 user`, () => {
    return request(app.getHttpServer())
      .delete('/user/002')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  })
})