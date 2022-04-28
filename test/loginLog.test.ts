import request from 'supertest';

import server from '../src/index';

afterEach(()=>{
  server.close();
});
const serverUrl = '/api/v1/serverLoginLog';

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

/** find loginLog */
test('2. success to get user by id name test01, return user data list success obj', async () => {
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