import request from 'supertest';
import { v4 as uuid } from 'uuid';

import server from '../src/index';
// import server from './testServer';

afterEach(()=>{
  server.close();
});
const serverUrl = '/api/v1/serverUser';

// cache data
let token = '';
let authObj: any;

const getRandomName = (len = 6) => uuid().slice(0, len);

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
let name = getRandomName();

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

test('2. fail to create user if typing same name test01, return `name already exists`', async () => {
  const res = await request(server)
  .post(serverUrl)
  .set('authorization', token)
  .send({
    name: 'test01',
    password: '123456',
    dob: '1998-05-12',
		address: 'shanghai',
		description: 'good man',
  });
  expect(res.body.code).toBe(10002);
});

