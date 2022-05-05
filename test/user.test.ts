import request from 'supertest';
import { v4 as uuid } from 'uuid';

import server from '../src/index';

afterEach(()=>{
  server.close();
});
const serverUrl = '/api/v1/serverUser';

// cache data
let token = '';
let authObj: any;

const getRandomName = (len = 6) => uuid().slice(0, len);

/** login to get token */
test('-3. success to longin if typing admin:admin123, strategy error, return successAuthObj', async () => {
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

/** create user */
/**
 * init dabase create admin
 *test('-3. create user if typing admin:admin123, returns create user success data', async () => {
  const res = await request(server)
    .post(serverUrl)
    .send({
      name: 'admin',
      password: 'admin123',
      dob: '1986-08-10',
      address: 'shanghai',
      description: 'good man',
    });
  expect(res.body.code).toBe(200);
});
test('-2. success to longin if typing admin:admin123, strategy error, return successAuthObj', async () => {
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
*/


// test('-1. create user if typing test01:123456, returns create success user data', async () => {
//   const res = await request(server)
//     .post(serverUrl)
//     .set('authorization', token)
//     .send({
//       name: 'test01',
//       password: '123456',
//       dob: '1998-05-12',
//       address: 'shanghai',
//       description: 'good man',
//     });
//   expect(res.body.code).toBe(200);
// });

test('0. create user if typing test02:123456, but no token, return `unauthorized`', async () => {
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

// to test user's id, name
let id = '';
const name = getRandomName();

// use find check name whether be used, is exists to user it to test
test(`1. success to get user by id name: ${name}, return user data list success obj`, async () => {
  // const findName = 'test01';
  // const res = await request(server)
  //   .get(serverUrl)
  //   .set('authorization', token)
  //   .query({
  //     name: findName,
  //   });
  //   if (res.body.code === 200) {
  //     id = res.body.data[0]._id;
  //     name = findName;
  //   }
  //   expect(res.body.code).toBe(200);
  //   expect(res.body.data[0].name).toEqual(findName);
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

test(`2. create user if typing ${name}:123456, returns create success user data`, async () => {
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
  if (res.body.code === 200) {
    id = res.body.data._id.toString();
  }
  expect(res.body.code).toBe(200);
});

test(`3. fail to create user if typing same name ${name}, return \'name already exists\'`, async () => {
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
  expect(res.body.code).toBe(10002);
});

test('4. fail to create user if typing same name test02 and no password, return `arg `password` is required`', async () => {
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

/** get user */
test(`5. fail to get user by id, ${id},return user data`, async () => {
  const res = await request(server)
    .get(serverUrl+`/${id}`)
    .set('authorization', token);
  expect(res.body.code).toBe(200);
  expect(res.body.data.name).toEqual(name);
  expect(res.body.data._id).toBe(id);
});

test(`6. fail to get user by id , ${id},but no token, returns 'unauthorized'`, async () => {
  const res = await request(server)
    .get(serverUrl+`/${id}`);
  expect(res.body.code).toBe(401);
});

test('7. fail to get user by id 1000, return `not found`', async () => {
  const res = await request(server)
    .get(serverUrl+'/1000')
    .set('authorization', token);
  expect(res.body.code).toBe(404);
});

/** update user */
test('8. fail to update user by {}, return `not found`', async () => {
  const res = await request(server)
    .put(serverUrl+`/${id}`)
    .set('authorization', token)
    .send({});
  expect(res.body.code).toBe(406);
});

test('9. fail to update user by not exists id, 1000, return `not found`', async () => {
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


test(`10. success to update user by id, ${id}, {address: 'jiangsu',description: 'good man01' }, return updated user data`, async () => {
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
  expect(res.body.data.address).toBe(address);
  expect(res.body.data.description).toBe(description);
});

/** remove */
test('11. fail to remove user by not exists id, 1000, return `not found`', async () => {
  const res = await request(server)
    .delete(serverUrl+'/1000')
    .set('authorization', token)
    .send();
  expect(res.body.code).toBe(404);
});

/** patch user success */
test(`12. success to patch user by id, ${id}, {address: 'jiangsu',description: 'good man01' }, return updated user data`, async () => {
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

/** find user*/
test('13 success to get user by id name test01, return user data list success obj', async () => {
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

/** patch user */
test('14. fail to patch user by {}, return `do not have any verify data`', async () => {
  const res = await request(server)
    .patch(serverUrl+`/${id}`)
    .set('authorization', token)
    .send({});
  expect(res.body.code).toBe(406);
});

test('15. fail to patch user by not exists id, 1000, return `not found`', async () => {
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

test('16. success to patch user by not exists id, admin, return `name already exists`', async () => {
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
  expect(res.body.code).toBe(10002);
});

/** remove user sucess*/
test(`17. success to remove user by id, ${id}, return 'isDeleted is true'`, async () => {
  const res = await request(server)
    .delete(serverUrl+`/${id}`)
    .set('authorization', token)
    .send();
  expect(res.body.code).toBe(200);
  expect(res.body.data.isDeleted).toBe(true);
});