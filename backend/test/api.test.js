import moment from 'moment';
import supertest from 'supertest';

import { initDB } from '../db/init';
import { Member } from '../db/models';
import app from '../../app';

beforeAll(async () => {
  /*
   * Mock some data before the start of this test
   */
  await initDB({ force: true });
  await Member.create({
    name: 'Jack',
    dob: '9999-99-99',
    address: { type: 'Point', coordinates: [121.461966, 31.220272] },
    description: 'cool guy',
    createdAt: moment().tz('Asia/Shanghai'),
  });
  await Member.create({
    name: 'Daniel Craig',
    dob: '1968-03-03',
    address: { type: 'Point', coordinates: [121.458715, 31.221061] },
    description: 'Daniel Wroughton Craig is an English actor.',
    createdAt: moment().tz('Europe/London'),
  });
});

// Apis tests below
test('GET /api/v1/members/', async () => {
  await supertest(app)
    .get('/api/v1/members/')
    .expect(200)
    .then((response) => {
      // Check length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(2);
      // Todo: check data
    });
});

test('GET /api/v1/members/2', async () => {
  await supertest(app)
    .get('/api/v1/members/2')
    .expect(200)
    .then((response) => {
      // Check data
      expect(response.body.name).toBe('Daniel Craig');
      // Todo: check more
    });
});

test('POST /api/v1/members/', async () => {
  const payload = {
    name: 'Léa Seydoux',
    dob: '1985-07-01',
    address: [121.4141971, 31.202561],
    description: 'Léa Hélène Seydoux-Fornier de Clausonne is a French actress.',
  };
  await supertest(app)
    .post('/api/v1/members/')
    .send(payload)
    .expect(200)
    .then((response) => {
      // Check id
      expect(response.body.id).toEqual(3);
    });
});

test('PUT /api/v1/members/5', async () => {
  const payload = {
    name: 'Jack Li',
    dob: '8888-88-88',
    address: [121.461966, 31.220272],
    description: 'Very cool guy',
  };
  await supertest(app).put('/api/v1/members/5').send(payload).expect(404);
});

test('PUT /api/v1/members/1', async () => {
  const payload = {
    name: 'Jack Li',
    dob: '8888-88-88',
    address: [121.461966, 31.220272],
    description: 'Very cool guy',
  };
  await supertest(app)
    .put('/api/v1/members/1')
    .send(payload)
    .expect(200)
    .then((response) => {
      // Check status
      expect(response.body.updated).toEqual(true);
    });
});

test('DELETE /api/v1/members/5', async () => {
  // Try to delete a member which does not exists
  await supertest(app).delete('/api/v1/members/5').expect(404);
});

test('DELETE /api/v1/members/1', async () => {
  await supertest(app)
    .delete('/api/v1/members/1')
    .expect(200)
    .then((response) => {
      // Check status
      expect(response.body.deleted).toEqual(true);
    });
});

// Test the nearby api
test('GET /api/v1/nearby/', async () => {
  // Close to 121.458715, 31.221061
  await supertest(app)
    .get('/api/v1/nearby/?distance=300&long=121.459102&lat=31.222101')
    .expect(200)
    .then((response) => {
      // Check status
      expect(response.body.length).toEqual(1);
    });
});

test('GET /api/v1/nearby/', async () => {
  // try errors
  await supertest(app)
    .get('/api/v1/nearby/?distance=fff&long=121.459102&lat=31.222101')
    .expect(400)
    .then((response) => {
      // Check status
      expect(response.body.length).toEqual(1);
    });
});

test('GET /api/v1/nearby/', async () => {
  // try errors
  await supertest(app)
    .get('/api/v1/nearby/?distance=fff&long=999&lat=-999')
    .expect(400)
    .then((response) => {
      // Check status
      expect(response.body.length).toEqual(3);
    });
});