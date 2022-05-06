import request from 'supertest';

import server from '../src/index';
import { getRandomStr } from '../src/utils/utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { initAdmin } = require('./initAdmin.test');

afterEach(()=>{
  server.close();
});
const serverUrl = '/api/v1/serverLocation';

// cache data
let token = '';
let authObj: any;
let id = '';


describe('5. Follower tests', () => {
  // to init admin user
  initAdmin;
  describe('5.0 admin login', () => {
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
        authObj = res.body.data;
      }
      expect(res.body.code).toBe(200);
      expect(res.body.data.user.name).toEqual('admin');
    });
  });

  describe('5.1 create location', () => {
    const name = getRandomStr();
    test(`1. success create user if typing name:${name} password:123456, returns create success user data`, async () => {
      const res = await request(server)
        .post('/api/v1/serverUser')
        .set('authorization', token)
        .send({
          name,
          password: '123456',
          dob: '1998-05-12',
          address: 'shanghai',
          description: 'good man',
        });
      id = res.body.data._id.toString();
      expect(res.body.code).toBe(200);
      expect(res.body.data.name).toEqual(name);
    });
    test(`2. success to create location by id:${id}, return user data list success obj`, async () => {
      const res = await request(server)
        .post(serverUrl)
        .set('authorization', token)
        .send({
          userId: id,
          loc: [108, 48]
        });
      expect(res.body.code).toBe(200);
      expect(res.body.data.userId).toBe(id);
    });
  });

  describe('5.2 find location', () => {
    test('1. success to get user location by loc:[110,40],maxDistance:100 meter , return user data list success obj', async () => {
      const res = await request(server)
        .get(serverUrl)
        .set('authorization', token)
        .query({
          loc: [110, 40],
          maxDistance: 100
        });
      expect(res.body.code).toBe(200);
    });

    test(`2. success to get user location by loc:[110,40],maxDistance:100 meter, userId:${id} , return user data list success obj`, async () => {
      const res = await request(server)
        .get(serverUrl)
        .set('authorization', token)
        .query({
          loc: [110, 40],
          maxDistance: 100,
          userId: id
        });
      expect(res.body.code).toBe(200);
      if (res.body.code === 200 && res.body.data.length) {
        expect(res.body.data[0].userId).toBe(id);
      }
    });
  });
});