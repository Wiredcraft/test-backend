import supertest from 'supertest';

import { app } from '../../../../app';
import { UserModel, createRouteParams, patchRouteParams, updateRouteParams } from '../types';
import { config } from '../../../../config';
import * as db from '../../../utils/mongoDb';
import * as fixtures from './fixtures';

const server = app.callback();
const request: supertest.SuperTest<supertest.Test> = supertest(server);

jest.setTimeout(50000);

beforeAll(async () => {
  await db.waitForConnection();
  await db.mongoose.connection.db.dropDatabase();

  await db.mongoose.connection.db.collection('users').insertMany(fixtures.users);
});

afterAll(async () => {
  await db.mongoose.connection.db.dropDatabase();
  await db.mongoose.connection.close(true);
});


describe('/user routes', () => {

  it('should return 404 when getting a user that does not exist', async () => {
    const res = await request
      .get(`/v1/user/THIS_USER_DOES_NOT_EXIST`)
      .send();

    expect(res.statusCode).toEqual(404);
  });

  it('should return 200 and the user profile', async () => {
    const res = await request
      .get(`/v1/user/${fixtures.users[0].id}`)
      .send();

    expect(res.statusCode).toEqual(200);
    const user = JSON.parse(res.text) as UserModel;

    expect(user.name).toBe(fixtures.users[0].name);
    expect(user.dob).toBe(fixtures.users[0].dob);
    expect(user.description).toBe(fixtures.users[0].description);
    expect(user.address).toBe(fixtures.users[0].address);
  });

  it('should return 200 and the default number of profiles per page', async () => {
    const res = await request
      .get(`/v1/user`)
      .send();

    expect(res.statusCode).toEqual(200);
    const body = JSON.parse(res.text) as UserModel[];
    expect(body.length).toBe(config.pagination.userList.defaultPerPage);

    for (let i = 0; i < fixtures.users.length; i++) {
      expect(body[i].name).toBe(fixtures.users[i].name);
      expect(body[i].dob).toBe(fixtures.users[i].dob);
      expect(body[i].description).toBe(fixtures.users[i].description);
      expect(body[i].address).toBe(fixtures.users[i].address);
    }
  });

  it('should return 200 and create a user profile', async () => {
    const body: createRouteParams = {
      name: 'Fake User',
      dob: '06-14-1994',
      address: 'This is an address',
      description: 'This is a description',
    };
    let res = await request
      .post(`/v1/user`)
      .send(body);

    expect(res.statusCode).toEqual(200);

    // Check response value
    let response = JSON.parse(res.text) as UserModel;
    expect(response.dob).toBe(body.dob);
    expect(response.id).toBeDefined();
    expect(response.name).toBe(body.name);
    expect(response.address).toBe(body.address);
    expect(response.description).toBe(body.description);

    const id = response.id;
    // Check that we can the GET endpoint returns it correctly
    res = await request
      .get(`/v1/user/${id}`)
      .send();

    response = JSON.parse(res.text) as UserModel;
    expect(response.dob).toBe(body.dob);
    expect(response.name).toBe(body.name);
    expect(response.address).toBe(body.address);
    expect(response.description).toBe(body.description);
  });

  it('should return 200 and update a user profile', async () => {
    const postBody: patchRouteParams = {
      name: 'User To Be Deleted',
      dob: '06-14-1994',
      address: 'This is an address',
      description: 'This is a description',
    };
    let res = await request
      .post(`/v1/user`)
      .send(postBody);
    let response = JSON.parse(res.text) as UserModel;

    const body: updateRouteParams = {
      name: 'Fake User',
      dob: '06-14-1994',
      address: 'This is an address',
      description: 'This is a description',
    };
    res = await request
      .put(`/v1/user/${response.id}`)
      .send(body);

    expect(res.statusCode).toEqual(200);
    response = JSON.parse(res.text) as UserModel;
    expect(response.dob).toBe(body.dob);
    expect(response.name).toBe(body.name);
    expect(response.address).toBe(body.address);
    expect(response.description).toBe(body.description);
  });


  it('should return 200 and patch a user profile by updating only one field', async () => {
    const postBody: patchRouteParams = {
      name: 'User To Be Deleted',
      dob: '06-14-1994',
      address: 'This is an address',
      description: 'This is a description',
    };
    let res = await request
      .post(`/v1/user`)
      .send(postBody);
    let response = JSON.parse(res.text) as UserModel;

    const body: patchRouteParams = {
      address: 'This is another address',
    };
    res = await request
      .patch(`/v1/user/${response.id}`)
      .send(body);

    expect(res.statusCode).toEqual(200);
    response = JSON.parse(res.text) as UserModel;
    expect(response.dob).toBe(postBody.dob);
    expect(response.name).toBe(postBody.name);
    expect(response.address).toBe(body.address);
    expect(response.description).toBe(postBody.description);
  });

  it('should return 200 and delete a user profile', async () => {

    const body: patchRouteParams = {
      name: 'User To Be Deleted',
      dob: '06-14-1994',
      address: 'This is an address',
      description: 'This is a description',
    };
    let res = await request
      .post(`/v1/user`)
      .send(body);
    const response = JSON.parse(res.text) as UserModel;


    res = await request
      .del(`/v1/user/${response.id}`)
      .send();

    expect(res.statusCode).toEqual(200);

    res = await request
      .get(`/v1/user/${response.id}`)
      .send();

    expect(res.statusCode).toEqual(404);
  });
});
