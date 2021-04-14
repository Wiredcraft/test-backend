import request from 'supertest';
import mongoose from 'mongoose';
import config from '../src/config/config';
import app from '../src/index';
import User from '../src/models/User';

describe('Root path -> 404', () => {
  test('It should response the GET method with 404 status', async done => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(404);
    done();
  });
});

describe('Docs path -> 200', () => {
  test('It should response the GET method with 200 status', async done => {
    const response = await request(app).get('/v1/docs/');
    expect(response.statusCode).toBe(200);
    done();
  });
});

describe('Users path', () => {
  beforeAll(async () => {
    // mongodb connection -> create user
    mongoose.Promise = Promise;
    const db_uri = `mongodb://${config.mongo.user}:${config.mongo.password}`
      + `@${config.mongo.host}:${config.mongo.port}/${config.mongo.db_name}`;
    mongoose.connect(db_uri, { useUnifiedTopology: true, useNewUrlParser: true });
    mongoose.connection.on('error', () => {
      throw new Error(`unable to connect to database: ${db_uri}`);
    });
    // init a user fixture for testing.
    const user = new User({
      _id: '6060075025ec841ba5b3a93b',
      name: 'Amy',
      dob: '2000-01-01',
      address: 'aaa',
      location: {
        coordinates: [121.65, 31.32]
      },
      description: 'ddd'
    });
    await user.save();
  });

  afterAll(async () => {
    // remove all testing users and close connection.
    await User.deleteMany({});
    mongoose.connection.close();
  });

  test('It should be able to create a user via /POST request', async done => {
    const data = {
      name: 'Bob',
      dob: '2000-01-01',
      address: 'aaa',
      location: {
        coordinates: [121.65, 31.32]
      },
      description: 'ddd'
    };
    const response = await request(app)
      .post('/v1/users')
      .send(data);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(data.name);
    done();
  });

  test('It should be able to /GET a particular user by Id', async done => {
    const response = await request(app).get('/v1/users/6060075025ec841ba5b3a93b');
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe('6060075025ec841ba5b3a93b');
    expect(response.body.name).toBe('Amy');
    done();
  });

  test('It should return 404 if /GET a user with invlid Id', async done => {
    const response = await request(app).get('/v1/users/someinvalidid');
    expect(response.statusCode).toBe(404);
    done();
  });

  test('It should be able to /GET multiple users', async done => {
    const response = await request(app).get('/v1/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    done();
  });

  test('It should be able to update a user via /PUT request', async done => {
    const data = { name: 'Aimee', dob: '2000-01-01', address: 'aaa', description: 'ddd' };
    const response = await request(app)
      .put('/v1/users/6060075025ec841ba5b3a93b')
      .send(data);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Aimee');
    done();
  });

  test('It should be able to delete a user via /DELETE request', async done => {
    const response = await request(app).delete('/v1/users/6060075025ec841ba5b3a93b');
    expect(response.statusCode).toBe(204);
    done();
  });

  test('It should return 404 if /DELTE a user with non-existing Id', async done => {
    const response = await request(app).delete('/v1/users/6060075025ec841ba5b3a93b');
    expect(response.statusCode).toBe(404);
    done();
  });

  test('It should return 404 if /GET a user with non-existing Id', async done => {
    const response = await request(app).get('/v1/users/6060075025ec841ba5b3a93b');
    expect(response.statusCode).toBe(404);
    done();
  });
})
