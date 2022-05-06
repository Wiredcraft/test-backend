import request from 'supertest';

import server from '../src/index';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { initAdmin } = require('./initAdmin.test');

afterEach(()=>{
  server.close();
});
const serverUrl = '/api/v1/serverLoginLog';

// cache data
let token = '';
let authObj: any;
let id = '';

describe('2. Login tests', () => {
  // to init admin user
  initAdmin;
  describe('2.0 admin login', () => {

    it('1. should loin success by name:admin', async () => {
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
        authObj = res.body.data;
        id = res.body.data.id;
      }
      expect(res.body.code).toBe(200);
      expect(res.body.data.user.name).toEqual('admin');
    });

  });

  describe('2.1 find login', () => {
    test(`1. success to get user by userId:${id}, return user login data list success obj`, async () => {
      const userId = authObj.user.id;
      const res = await request(server)
        .get(serverUrl)
        .set('authorization', token)
        .query({
          userId,
        });
      expect(res.body.code).toBe(200);
      expect(res.body.data[0].userId).toBe(userId);
    });
  });

});