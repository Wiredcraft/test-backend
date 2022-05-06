import request from 'supertest';

import server from '../src/index';
import { getRandomStr } from '../src/utils/utils';
// import { initAdmin } from './initAdmin.test';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { initAdmin } = require('./initAdmin.test');

afterEach(()=>{
  server.close();
});

const serverUrl = '/authorization';

let token = '';

describe('3. Authorization tests', () => {
  // to init admin user
  initAdmin;
  describe('3.0 admin login', () => {
    test('1. success to longin if typing admin:admin123, strategy error, return successAuthObj', async () => {
      const res = await request(server)
        .post('/authorization')
        .send({
          name: 'admin',
          password: 'admin123',
          strategy: 'local'
        });
      // console.log('longin success:', res.body);
      if (res.body.code === 200) {
        token = res.body.data.token;
      }
      expect(res.body.code).toBe(200);
      expect(res.body.data.user.name).toEqual('admin');
    });
  });

  describe('3.1 create authorization by local', () => {

    const name = getRandomStr();
    const password = '123456';
    test(`1. success create user if typing name:${name} password:${password}, to get the userName, returns create success user data`, async () => {
      const res = await request(server)
        .post('/api/v1/serverUser')
        .set('authorization', token)
        .send({
          name,
          password,
          dob: '1978-03-26',
          address: 'shanghai',
          description: 'good man',
        });
      expect(res.body.code).toBe(200);
      expect(res.body.data.name).toEqual(name);
    });

    test(`2. fail to longin if typing name:${name}, password:${password}, return \'no strategy\'`, async () => {
      const res = await request(server)
        .post(serverUrl)
        .send({
          name: 'test09',
          password
        });
      expect(res.body.code).toBe(401);
    });

    test('3. fail to longin if typing test09 no password, return `username or password is invalid`', async () => {
      const res = await request(server)
        .post(serverUrl)
        .send({
          name: 'test09',
        });
      expect(res.body.code).toBe(401);
    });

    test('4. fail to longin if typing neme:te23412sjdk, password:123456, return `user not exist`', async () => {
      const res = await request(server)
        .post(serverUrl)
        .send({
          name: 'te23412sjdk',
          password: '123456',
          strategy: 'local'
        });
      expect(res.body.code).toBe(401);
    });

    test(`5. fail to longin if typing name:${name}, password:1234567, password error, return \'username or password is invalid\'`, async () => {
      const res = await request(server)
        .post(serverUrl)
        .send({
          name,
          password: '1234567',
          strategy: 'local'
        });
      expect(res.body.code).toBe(401);
    });

    test(`6. fail to longin if typing name:${name}, password:${password}, strategy error, return \'google is not supported!\'`, async () => {
      const res = await request(server)
        .post(serverUrl)
        .send({
          name,
          password,
          strategy: 'google'
        });
      expect(res.body.code).toBe(401);
    });

    test(`7. fail to longin if typing name:${name}, password:${password}, wrong url, return \'not found\'`, async () => {
      const res = await request(server)
        .post(serverUrl+'abc')
        .send({
          name,
          password,
          strategy: 'local'
        });
      expect(res.body.code).toBe(404);
    });

    test(`8. success to longin if typing name:${name}, password:${password}, return successAuthObj`, async () => {
      const res = await request(server)
        .post(serverUrl)
        .send({
          name,
          password,
          strategy: 'local'
        });
      if (res.body.code === 200) {
        token = res.body.data.token;
      }
      expect(res.body.code).toBe(200);
      expect(res.body.data.user.name).toEqual(name);
    });
  });

  describe('3.2  test authorization by jwt', () => {
    test('1. fail to longin if token expired, jwt expired, return `jwt unauthorized`', async () => {
      // This token value depends on the Auth key
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL3lvdXJkb21haW4uY29tIiwiaXNzIjoiZG9tYWluIiwic3ViIjoiNjI2OTc0NzlkYjFiZWI4MWJhNDRkMjZhIiwianRpIjoiOTIzYzkzNDYtYThjYy00MzY4LTk4ZjMtNWJmZmJjYWRmMjY3IiwiaWF0IjoxNjUxMDc4NDM3LCJleHAiOjE2NTExNjQ4Mzd9.WbbdHC0sr6aOlyyloG-jvaEhbh02H2US9ZOG-8Fr0lY';
      const res = await request(server)
        .post(serverUrl)
        .set('authorization', expiredToken)
        .send({
          strategy: 'jwt'
        });
      expect(res.body.code).toBe(401);
    });

    test('2. fail to longin if token is wrong, jwt verify fail, return `jwt unauthorized`', async () => {
      // any wrong token
      const expiredToken = '11111eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL3lvdXJkb21haW4uY29tIiwiaXNzIjoiZG9tYWluIiwic3ViIjoiNjI2OTc0NzlkYjFiZWI4MWJhNDRkMjZhIiwianRpIjoiOTIzYzkzNDYtYThjYy00MzY4LTk4ZjMtNWJmZmJjYWRmMjY3IiwiaWF0IjoxNjUxMDc4NDM3LCJleHAiOjE2NTExNjQ4Mzd9.WbbdHC0sr6aOlyyloG-jvaEhbh02H2US9ZOG-8Fr0lY';
      const res = await request(server)
        .post(serverUrl)
        .set('authorization', expiredToken)
        .send({
          strategy: 'jwt'
        });
      expect(res.body.code).toBe(401);
    });

    test('3. success to longin if typing test01:123456, strategy error, return success Auth user data', async () => {
      if (!token) {
        throw new Error('don\'t have token!');
      }
      const res = await request(server)
        .post(serverUrl)
        .set('authorization', token)
        .send({
          strategy: 'jwt'
        });
      console.log('success:', res.body);
      expect(res.body.code).toBe(404);
    });
  });

});
