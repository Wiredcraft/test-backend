import request from 'supertest';

import server from '../src/index';

afterEach(()=>{
  server.close();
});
const serverUrl = '/api/v1/serverFollower';

// cache data
let token = '';
let authObj: any;

/** login to get token */
test('1. success to longin if typing admin:admin123, strategy error, return successAuthObj', async () => {
  const res = await request(server)
    .post('/authorization')
    .send({
      name: 'admin',
      password: 'admin123',
      strategy: 'local'
    });
  console.log('longin success:', res.body);
  if (res.body.code === 200) {
    token = res.body.data.token;
    authObj = res.body.data;
  }
  expect(res.body.code).toBe(200);
  expect(res.body.data.user.name).toEqual('admin');
});

let delId;
test('2. success to create user follower by name test01, return user data list success obj', async () => {
  const starUserId = '626e4a7cc0ce5cc9b6f0c1ad';
  const res = await request(server)
    .post(serverUrl)
    .set('authorization', token)
    .send({
      starUserId,
      fansUserId: '626e4a7cc0ce5cc9b6f0c1b1'
    });
  if (res.body.code === 200) {
    delId = res.body.data._id;
  }
  expect(res.body.code).toBe(200);
  expect(res.body.data.starUserId).toBe(starUserId);
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

/** find loginLog */
test('5. success to get user follower data  by no query, return user follower data list success obj', async () => {
  const res = await request(server)
    .get(serverUrl)
    .set('authorization', token)
    .query({});
  expect(res.body.code).toBe(200);
});

test('6. success to get user follower data by starUserId = userId, return user follower data list success obj', async () => {
  const userId = authObj.user.id;
  const res = await request(server)
    .get(serverUrl)
    .set('authorization', token)
    .query({
      starUserId: userId,
    });
  expect(res.body.code).toBe(200);
  if (res.body.data.length) {
    expect(res.body.data[0].starUserId).toBe(userId);
  }
});

test('7. success to get user follower data by funsUserId = userId, return user follower data list success obj', async () => {
  const userId = authObj.user.id;
  const res = await request(server)
    .get(serverUrl)
    .set('authorization', token)
    .query({
      fansUserId: userId
    });
  expect(res.body.code).toBe(200);
  if (res.body.data.length) {
    expect(res.body.data[0].fansUserId).toBe(userId);
  }
});

/** remove user follower */
test('8. success to delete user follower by id , return user follower data `isDeleted: true` success object', async () => {
  // console.log('delId===>>', delId);
  const res = await request(server)
    .delete(serverUrl+ `/${delId}`)
    .set('authorization', token)
    .send();
  expect(res.body.code).toBe(200);
  expect(res.body.data.isDeleted).toBe(true);
});

