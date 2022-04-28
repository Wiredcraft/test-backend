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

// to test jwt middleware
let token = '';
test('6. success to longin if typing test01:123456, strategy error, return successAuthObj', async () => {
  const res = await request(server)
    .post(serverUrl)
    .send({
      name: 'test01',
      password: '123456',
      strategy: 'local'
    });
  console.log('success:', res.body);
  if (res.body.code === 200) {
    token = res.body.data.token;
  }
  expect(res.body.code).toBe(200);
  expect(res.body.data.user.name).toEqual('test01');
});

// test jwt middleware
test('7. success to longin if typing test01:123456, strategy error, return successAuthObj', async () => {
  if (!token) {
    throw new Error('don\'t have token!');
  }
  console.log('token====> ', token);
  const res = await request(server)
    .post(serverUrl)
    .set('authorization', token)
    .send({
      strategy: 'jwt'
    });
  console.log('success:', res.body);
  expect(res.body.code).toBe(200);
});
