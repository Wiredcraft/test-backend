import request from 'supertest';
import app from '../app';

import { TestDBManager } from '../database';

const testDB = new TestDBManager();
beforeAll(async () => testDB.start());
afterAll(async () => testDB.stop());

describe('POST /register', () => {
  it('should responds with register successful', done => {
    request(app)
      .post('/register')
      .send({ username: 'testUser', password: '123456' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        return done();
      });
  });
});
