import request from 'supertest';

import server from '../src/index';
// import server from './testServer';

afterEach(()=>{
  server.close();
});

const serverUrl = '/authorization';

test('1. fail to longin if typing test09:123456, return `no strategy`', async () => {
  const res = await request(server)
    .post(serverUrl)
    .send({
      name: 'test09',
      password: '123456'
    });
  expect(res.body.code).toBe(401);
});

test('2. fail to longin if typing test09 no password, return `username or password is invalid`', async () => {
  const res = await request(server)
    .post(serverUrl)
    .send({
      name: 'test09',
    });
  expect(res.body.code).toBe(401);
});

test('3. fail to longin if typing tesjdk:123456, return `user not exist`', async () => {
  const res = await request(server)
    .post(serverUrl)
    .send({
      name: 'tesjdk',
      password: '123456',
      strategy: 'local'
    });
  expect(res.body.code).toBe(401);
});

test('4. fail to longin if typing test01:1234567, password error, return `username or password is invalid2`', async () => {
  const res = await request(server)
    .post(serverUrl)
    .send({
      name: 'test01',
      password: '1234567',
      strategy: 'local'
    });
  expect(res.body.code).toBe(401);
});

test('5. fail to longin if typing test01:123456, strategy error, return `google is not supported!`', async () => {
  const res = await request(server)
    .post(serverUrl)
    .send({
      name: 'test01',
      password: '123456',
      strategy: 'google'
    });
  expect(res.body.code).toBe(401);
});

test('5. fail to longin if typing test01:123456, wrong url, return `not found`', async () => {
  const res = await request(server)
    .post(serverUrl+'abc')
    .send({
      name: 'test01',
      password: '123456',
      strategy: 'local'
    });
  expect(res.body.code).toBe(404);
});

let token = '';
test('6. success to longin if typing test01:123456, strategy error, return successAuthObj', async () => {
  const res = await request(server)
    .post(serverUrl)
    .send({
      name: 'test01',
      password: '123456',
      strategy: 'local'
    });
  // console.log('success:', res.body);
  if (res.body.code === 200) {
    token = res.body.data.token;
  }
  expect(res.body.code).toBe(200);
  expect(res.body.data.user.name).toEqual('test01');
});

/** to test jwt middleware */
test('7. fail to longin if token expired, jwt expired, return `jwt unauthorized`', async () => {
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

test('8. fail to longin if token is wrong, jwt verify fail, return `jwt unauthorized`', async () => {
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

test('9. success to longin if typing test01:123456, strategy error, return success Auth user data', async () => {
  if (!token) {
    throw new Error('don\'t have token!');
  }
  // console.log('success token====> ', token);
  const res = await request(server)
    .post(serverUrl)
    .set('authorization', token)
    .send({
      strategy: 'jwt'
    });
  // console.log('success:', res.body);
  expect(res.body.code).toBe(404);
});
