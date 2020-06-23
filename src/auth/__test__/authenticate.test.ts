import request from 'supertest';

import app from '../../app';
import { TestDBManager } from '../../database';

const testDB = new TestDBManager();
beforeAll(async () => testDB.start());
afterAll(async () => testDB.stop());

describe('Register', () => {
  it('Should create a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testUser', password: '123456' });
    expect(response.status).toBe(200);
    expect(response.text).toBe('register successful');
  });
});

describe('Login', () => {
  it('Should be able to login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testUser', password: '123456' });
    expect(response.status).toBe(200);
    expect(response.text).toEqual('login successful');
  });
});
