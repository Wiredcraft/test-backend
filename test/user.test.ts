import request from 'supertest';

import server from '../src/index';
import { getRandomStr } from '../src/utils/utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { initAdmin } = require('./initAdmin.test');

afterEach(()=>{
  server.close();
});
const serverUrl = '/api/v1/serverUser';

// cache data
let token = '';
let authObj: any;
let id = '';

const name = getRandomStr();

describe('1. User tests', () => {
  // to init admin user
  initAdmin;
  describe('1.0 admin login', () => {
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
      }
      expect(res.body.code).toBe(200);
      expect(res.body.data.user.name).toEqual('admin');
    });
  });
  describe('1.1 create user', () => {
    // use find check name whether be used, is exists to user it to test
    test(`1. find user by name:${name}, return user data list success obj`, async () => {
      const res = await request(server)
        .get(serverUrl)
        .set('authorization', token)
        .query({
          name,
        });
      if (res.body.code === 200 && res.body.total) {
        id = res.body.data[0]._id;
      }
      expect(res.body.code).toBe(200);
    });
    test(`2. success create user if typing name:${name} password:123456, returns create success user data`, async () => {
      const res = await request(server)
        .post(serverUrl)
        .set('authorization', token)
        .send({
          name,
          password: '123456',
          dob: '1998-05-12',
          address: 'shanghai',
          description: 'good man',
        });
      if (id) {
        expect(res.body.errorCode).toBe(10002);
      } else {
        id = res.body.data._id.toString();
        expect(res.body.code).toBe(200);
        expect(res.body.data.name).toEqual(name);
      }
    });

    test(`3. fail to create user if typing same name:${name}, return \'name already exists\'`, async () => {
      const res = await request(server)
        .post(serverUrl)
        .set('authorization', token)
        .send({
          name,
          password: '123456',
          dob: '1998-05-12',
          address: 'shanghai',
          description: 'good man01',
        });
      expect(res.body.code).toBe(406);
      expect(res.body.errorCode).toBe(10002);
    });

    test('4. fail to create user if typing test02:123456, but no token, return `unauthorized`', async () => {
      const res = await request(server)
        .post(serverUrl)
        .send({
          name: 'test02',
          password: '123456',
          dob: '1998-05-12',
          address: 'shanghai',
          description: 'good man',
        });
      expect(res.body.code).toBe(401);
    });

    test('5. fail to create user if typing same name test02 and no password, return `arg `password` is required`', async () => {
      const res = await request(server)
        .post(serverUrl)
        .set('authorization', token)
        .send({
          name: 'test02',
          dob: '1998-05-12',
          address: 'shanghai',
          description: 'good man',
        });
      expect(res.body.code).toBe(406);
    });
  });

  describe('1.2 get user', () => {
    test(`1. fail to get user by id:${id},but no token, returns 'unauthorized'`, async () => {
      const res = await request(server)
        .get(serverUrl+`/${id}`);
      expect(res.body.code).toBe(401);
    });

    test('2. fail to get user by id:1000, return `not found`', async () => {
      const res = await request(server)
        .get(serverUrl+'/1000')
        .set('authorization', token);
      expect(res.body.code).toBe(404);
    });

    test(`3. success to get user by id:${id}, return user data`, async () => {
      const res = await request(server)
        .get(serverUrl+`/${id}`)
        .set('authorization', token);
      expect(res.body.code).toBe(200);
      expect(res.body.data.name).toEqual(name);
      expect(res.body.data._id).toBe(id);
    });
  });


  describe('1.3 update user', () => {
    test('1. fail to update user by {}, return `not found`', async () => {
      const res = await request(server)
        .put(serverUrl+`/${id}`)
        .set('authorization', token)
        .send({});
      expect(res.body.code).toBe(406);
    });

    test('2. fail to update user by not exists id:1000, return `not found`', async () => {
      const address = 'jiangsu';
      const description = 'good man02';
      const res = await request(server)
        .put(serverUrl+'/1000')
        .set('authorization', token)
        .send({
          address,
          description,
        });
      expect(res.body.code).toBe(404);
    });


    test(`3. success to update user by id:${id}, {address: 'jiangsu',description: 'good man01' }, return updated user data`, async () => {
      const address = 'jiangsu';
      const description = 'good man02';
      const res = await request(server)
        .put(serverUrl+`/${id}`)
        .set('authorization', token)
        .send({
          address,
          description,
        });
      expect(res.body.code).toBe(200);
      expect(res.body.data.name).toBe(name);
      expect(res.body.data.address).toBe(address);
      expect(res.body.data.description).toBe(description);
    });
  });

  describe('1.4 find user', () => {
    test('1 success to find user by description:\'good man\' , return user data list success obj', async () => {
      const desc = 'good man';
      const res = await request(server)
        .get(serverUrl)
        .set('authorization', token)
        .query({
          description: desc,
        });
      expect(res.body.code).toBe(200);
      expect(res.body.data[0].description).toContain(desc);
    });

    test('2 fail to find user by error token, return `jwt unauthorized`', async () => {
      const token = 'NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL3lvdXJkb21haW4uY29tIiwia';
      const desc = 'good man';
      const res = await request(server)
        .get(serverUrl)
        .set('authorization', token)
        .query({
          description: desc,
        });
      expect(res.body.code).toBe(401);
    });
  });

  describe('1.5 patch user', () => {
    test('1. fail to patch user by {}, return `do not have any verify data`', async () => {
      const res = await request(server)
        .patch(serverUrl+`/${id}`)
        .set('authorization', token)
        .send({});
      expect(res.body.code).toBe(406);
    });

    test('2. fail to patch user by not exists id, 1000, return `not found`', async () => {
      const address = 'zhejiang';
      const description = 'good man03';
      const res = await request(server)
        .patch(serverUrl+'/1000')
        .set('authorization', token)
        .send({
          address,
          description,
        });
      expect(res.body.code).toBe(404);
    });

    test('3. fail to patch user by not exists id, admin, return `name already exists`', async () => {
      const address = 'zhejiang';
      const description = 'good man03';
      const res = await request(server)
        .patch(serverUrl+`/${id}`)
        .set('authorization', token)
        .send({
          name: 'admin',
          address,
          description,
        });
      expect(res.body.code).toBe(406);
      expect(res.body.errorCode).toBe(10002);
    });

    test(`4. success to patch user by id:${id}, {address: 'jiangsu',description: 'good man03' }, return updated user data`, async () => {
      const address = 'zhejiang';
      const description = 'good man03';
      const res = await request(server)
        .patch(serverUrl+`/${id}`)
        .set('authorization', token)
        .send({
          address,
          description,
        });
      expect(res.body.code).toBe(200);
      expect(res.body.data.address).toBe(address);
      expect(res.body.data.description).toBe(description);
    });
  });

  describe('1.6 remove user', () => {
    test('1. fail to remove user by not exists id, 1000, return `not found`', async () => {
      const res = await request(server)
        .delete(serverUrl+'/1000')
        .set('authorization', token)
        .send();
      expect(res.body.code).toBe(404);
    });

    test(`2. fail to remove user by id:${id}, but no token, returns 'unauthorized'`, async () => {
      const res = await request(server)
        .delete(serverUrl+`/${id}`)
        .send();
      expect(res.body.code).toBe(401);
    });

    test(`3. success to remove user by id:${id}, return 'isDeleted is true'`, async () => {
      const res = await request(server)
        .delete(serverUrl+`/${id}`)
        .set('authorization', token)
        .send();
      expect(res.body.code).toBe(200);
      expect(res.body.data.isDeleted).toBe(true);
    });
  });

  afterAll(() => {
    console.log('user test finished!');
  });
});
