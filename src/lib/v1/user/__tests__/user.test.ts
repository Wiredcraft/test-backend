import supertest from 'supertest';

import { app } from '../../../../app';
import { createRouteParams, patchRouteParams, updateRouteParams } from '../types';
import { config } from '../../../../config';
import * as db from '../../../utils/mongoDb';
import * as fixtures from './fixtures';
import { IUserDocument } from '../model';

jest.setTimeout(50000);

describe('/user routes', () => {
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

  it('should return 404 when getting a user that does not exist', async () => {
    const res = await request
      // 000000000000000000000000 Is a fake ID.
      .get(`/v1/user/000000000000000000000000`)
      .send();

    expect(res.statusCode).toEqual(404);
  });

  it('should return 200 and the default number of profiles per page', async () => {
    const res = await request
      .get(`/v1/user`)
      .send();

    expect(res.statusCode).toEqual(200);
    const body = JSON.parse(res.text) as IUserDocument[];
    expect(body.length).toBe(config.pagination.userList.defaultPerPage);
  });

  it('should return 422 when giving wrong parameters', async () => {
    const body: createRouteParams = {
      name: 'Fake User',
      dob: 'This is not a date',
      address: 'This is an address',
      description: 'This is a description',
    };
    const res = await request
      .post(`/v1/user`)
      .send(body);

    expect(res.statusCode).toEqual(422);
  })

    it('should return 200 and create a user profile', async () => {
    const body: createRouteParams = {
      name: 'Fake User',
      dob: '1994-06-14T00:00:00.000Z',
      address: 'This is an address',
      description: 'This is a description',
    };
    let res = await request
      .post(`/v1/user`)
      .send(body);

    expect(res.statusCode).toEqual(200);

    // Check response value
    let response = JSON.parse(res.text) as IUserDocument;
    expect(response.dob).toBe(body.dob);
    expect(response._id).toBeDefined();
    expect(response.name).toBe(body.name);
    expect(response.address).toBe(body.address);
    expect(response.description).toBe(body.description);

    const _id = response._id;
    // Check that we can the GET endpoint returns it correctly
    res = await request
      .get(`/v1/user/${_id}`)
      .send();

    response = JSON.parse(res.text) as IUserDocument;
    expect(response.dob).toBe(body.dob);
    expect(response.name).toBe(body.name);
    expect(response.address).toBe(body.address);
    expect(response.description).toBe(body.description);
  });

  it('should return 200 and update a user profile', async () => {
    const postBody: patchRouteParams = {
      name: 'User To Be Deleted',
      dob: '1994-06-14T00:00:00.000Z',
      address: 'This is an address',
      description: 'This is a description',
    };
    let res = await request
      .post(`/v1/user`)
      .send(postBody);
    let response = JSON.parse(res.text) as IUserDocument;

    const body: updateRouteParams = {
      name: 'Fake User',
      dob: '1994-06-14T00:00:00.000Z',
      address: 'This is an address',
      description: 'This is a description',
    };
    res = await request
      .put(`/v1/user/${response._id}`)
      .send(body);

    expect(res.statusCode).toEqual(200);
    response = JSON.parse(res.text) as IUserDocument;
    expect(response.dob).toBe(body.dob);
    expect(response.name).toBe(body.name);
    expect(response.address).toBe(body.address);
    expect(response.description).toBe(body.description);
  });


  it('should return 200 and patch a user profile by updating only one field', async () => {
    const postBody: patchRouteParams = {
      name: 'User To Be Deleted',
      dob: '1994-06-14T00:00:00.000Z',
      address: 'This is an address',
      description: 'This is a description',
    };
    let res = await request
      .post(`/v1/user`)
      .send(postBody);
    let response = JSON.parse(res.text) as IUserDocument;

    const body: patchRouteParams = {
      address: 'This is another address',
    };
    res = await request
      .patch(`/v1/user/${response._id}`)
      .send(body);

    expect(res.statusCode).toEqual(200);
    response = JSON.parse(res.text) as IUserDocument;
    expect(response.dob).toBe(postBody.dob);
    expect(response.name).toBe(postBody.name);
    expect(response.address).toBe(body.address);
    expect(response.description).toBe(postBody.description);
  });

  it('should return 200 and delete a user profile', async () => {

    const body: patchRouteParams = {
      name: 'User To Be Deleted',
      dob: '1994-06-14T00:00:00.000Z',
      address: 'This is an address',
      description: 'This is a description',
    };
    let res = await request
      .post(`/v1/user`)
      .send(body);
    const response = JSON.parse(res.text) as IUserDocument;


    res = await request
      .del(`/v1/user/${response._id}`)
      .send();

    expect(res.statusCode).toEqual(200);

    res = await request
      .get(`/v1/user/${response._id}`)
      .send();

    expect(res.statusCode).toEqual(404);
  });
});
