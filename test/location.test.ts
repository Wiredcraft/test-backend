import request from 'supertest';

import server from '../src/index';

afterEach(()=>{
  server.close();
});
const serverUrl = '/api/v1/serverLocation';

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

test('2. success to create location by name test01, return user data list success obj', async () => {
  const userId = '626e4a7cc0ce5cc9b6f0c1ad';
  const res = await request(server)
    .post(serverUrl)
    .set('authorization', token)
    .send({
      userId,
      loc: [108, 48]
    });
  expect(res.body.code).toBe(200);
  expect(res.body.data.userId).toBe(userId);
});

/** find loginLog */
test('3. success to get user location by loc:[110,40],maxDistance:1 , return user data list success obj', async () => {
  const res = await request(server)
    .get(serverUrl)
    .set('authorization', token)
    .query({
      loc: [110, 40],
      maxDistance: 10
    });
  expect(res.body.code).toBe(200);
});

test('4. success to get user location by loc:[110,40],maxDistance:1, userId:authObj.user.id , return user data list success obj', async () => {
  const userId = authObj.user.id;
  const res = await request(server)
    .get(serverUrl)
    .set('authorization', token)
    .query({
      loc: [110, 40],
      maxDistance: 10,
      userId
    });
  expect(res.body.code).toBe(200);
  if (res.body.code === 200 && res.body.data.length) {
    expect(res.body.data[0].userId).toBe(userId);
  }
});