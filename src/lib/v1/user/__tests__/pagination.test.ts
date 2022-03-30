import * as db from '../../../utils/mongoDb';
import * as fixtures from './fixtures';
import { UserModel } from '../types';
import { config } from '../../../../config';
import { app } from '../../../../app';
import supertest from 'supertest';
import dayjs from 'dayjs';
import { random } from 'lodash';


jest.setTimeout(50000);

describe('Test that the pagination and data ordering', () => {

  const server = app.callback();
  const request: supertest.SuperTest<supertest.Test> = supertest(server);

  beforeAll(async () => {
    await db.waitForConnection();
    await db.mongoose.connection.db.dropDatabase();
    await db.mongoose.connection.db.collection('users').insertMany(fixtures.users);
  });

  afterAll(async () => {
    await db.mongoose.connection.db.dropDatabase();
    await db.mongoose.connection.close(true);
  });


  it('Should return the default number of users ordered by creation date', async () => {
    const res = await request
      .get(`/v1/user`)
      .send();

    expect(res.statusCode).toEqual(200);
    const body = JSON.parse(res.text) as UserModel[];
    expect(body.length).toBe(config.pagination.userList.defaultPerPage);
    expect(body[0].id).toBe("USER_1");
    for (let i = 1; i < body.length; i++) {
      expect(dayjs(body[i - 1].createdAt).isAfter(body[i].createdAt))
    }
  });

  it('Should return the default number of users ordered by creation date starting by the second page', async () => {
    const res = await request
      .get(`/v1/user`)
      .query({
        page: 2
      });

    expect(res.statusCode).toEqual(200);
    const body = JSON.parse(res.text) as UserModel[];
    let lengthExpected

    if (fixtures.users.length >= config.pagination.userList.defaultPerPage * 2) {
      lengthExpected = config.pagination.userList.defaultPerPage
    } else {
      lengthExpected = fixtures.users.length - config.pagination.userList.defaultPerPage
    }
    expect(body.length).toBe(lengthExpected);
    expect(body[0].id === "USER_1").toBe(false);
    for (let i = 1; i < body.length; i++) {
      expect(dayjs(body[i - 1].createdAt).isAfter(body[i].createdAt))
    }
  });

  it('Should return the default number of users ordered by name in reverse alphabetic order', async () => {
    const res = await request
      .get(`/v1/user`)
      .query({
        orderBy: "name",
        orderDir: "desc"
      });

    expect(res.statusCode).toEqual(200);
    const body = JSON.parse(res.text) as UserModel[];

    expect(body.length).toBe(config.pagination.userList.defaultPerPage);
    expect(body[0].name).toBe("ZUser 7");
  });

  it('Should return a defined number of users ordered by name in alphabetic order', async () => {

    const perPage = (random() % (config.pagination.userList.maxPerPage < fixtures.users.length ? config.pagination.userList.maxPerPage : fixtures.users.length)) + 1
    const res = await request
      .get(`/v1/user`)
      .query({
        perPage
      });

    expect(res.statusCode).toEqual(200);
    const body = JSON.parse(res.text) as UserModel[];

    expect(body.length).toBe(perPage);
    expect(body[0].id).toBe("USER_1");
  });

  it('Should return a defined number of users ordered by name in reverse alphabetic order', async () => {
    const perPage = (random() % (config.pagination.userList.maxPerPage < fixtures.users.length ? config.pagination.userList.maxPerPage : fixtures.users.length)) + 1
    const res = await request
      .get(`/v1/user`)
      .query({
        perPage,
        orderBy: "name",
        orderDir:"asc"
      });

    expect(res.statusCode).toEqual(200);
    const body = JSON.parse(res.text) as UserModel[];

    expect(body.length).toBe(perPage);
    expect(body[0].id).toBe("USER_6");
  });

});
