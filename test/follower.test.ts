import request from 'supertest';

import server from '../src/index';
import { getRandomStr } from '../src/utils/utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { initAdmin } = require('./initAdmin.test');

afterEach(()=>{
  server.close();
});
const serverUrl = '/api/v1/serverFollower';

// cache data
let token = '';
let authObj: any;
let id = '';
let fansUserId = '';
let delId = '';

describe('4. Follower tests', () => {
  // to init admin user
  initAdmin;
  describe('4.0 admin login', () => {
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
        id = res.body.data.id;
      }
      expect(res.body.code).toBe(200);
      expect(res.body.data.user.name).toEqual('admin');
    });
  });

  describe('4.1 create follower', () => {
    const name = getRandomStr();
    test(`1. success create user if typing name:${name} password:123456, to get the fansUserId, returns create success user data`, async () => {
      const res = await request(server)
        .post('/api/v1/serverUser')
        .set('authorization', token)
        .send({
          name,
          password: '123456',
          dob: '1978-03-26',
          address: 'shanghai',
          description: 'good man',
        });
      fansUserId = res.body.data._id.toString();
      expect(res.body.code).toBe(200);
      expect(res.body.data.name).toEqual(name);
    });

    test(`2. success to create user follower by starUserId:${id} fansUserId:${fansUserId}, return user follower data success obj`, async () => {
      const res = await request(server)
        .post(serverUrl)
        .set('authorization', token)
        .send({
          starUserId: id,
          fansUserId
        });
      if (res.body.code === 200) {
        delId = res.body.data._id;
      }
      expect(res.body.code).toBe(200);
      expect(res.body.data.starUserId).toBe(id);
    });

    test('3. fail to create user follower by no starUserId, return `arg `starUserId` is required`', async () => {
      const res = await request(server)
        .post(serverUrl)
        .set('authorization', token)
        .send({
          fansUserId: authObj.user.id
        });
      expect(res.body.code).toBe(406);
    });

    test('4. fail to create user follower by starUserId = funsUserId, return `params is error`', async () => {
      const userId = authObj.user.id;
      const res = await request(server)
        .post(serverUrl)
        .set('authorization', token)
        .send({
          starUserId: userId,
          fansUserId: userId
        });
      expect(res.body.code).toBe(406);
    });

  });

  describe('4.2 find follower', () => {
    test('1. success to get user follower data  by no query, return user follower data list success obj', async () => {
      const res = await request(server)
        .get(serverUrl)
        .set('authorization', token)
        .query({});
      expect(res.body.code).toBe(200);
    });

    test(`2. success to get user follower data by starUserId:${id}, return user follower data list success obj`, async () => {
      const res = await request(server)
        .get(serverUrl)
        .set('authorization', token)
        .query({
          starUserId: id,
        });
      expect(res.body.code).toBe(200);
      if (res.body.data.length) {
        expect(res.body.data[0].starUserId).toBe(id);
      }
    });

    test(`3. success to get user follower data by funsUserId:${fansUserId}, return user follower data list success obj`, async () => {
      const res = await request(server)
        .get(serverUrl)
        .set('authorization', token)
        .query({
          fansUserId
        });
      expect(res.body.code).toBe(200);
      if (res.body.data.length) {
        expect(res.body.data[0].fansUserId).toBe(fansUserId);
      }
    });
  });

  describe('4.3 remove follwer', () => {
    test('8. success to delete user follower by id , return user follower data `isDeleted: true` success object', async () => {
      // console.log('delId===>>', delId);
      const res = await request(server)
        .delete(serverUrl+ `/${delId}`)
        .set('authorization', token)
        .send();
      expect(res.body.code).toBe(200);
      expect(res.body.data.isDeleted).toBe(true);
    });
  });
});

