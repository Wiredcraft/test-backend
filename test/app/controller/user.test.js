'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/controller/user.test.js', () => {
  before(() => {
    app.mockService('user', 'createUser', (opt) => {
      opt.id = 1;
      delete opt.pwd;
      return opt;
    });

    app.mockService('user', 'checkUsername', (name) => {
      return name === 'sameUser' ? true : false;
    });

    app.mockService('user', 'getUserById', (id) => {
      return {
        "id": id,
        "name": "test001",
        "dob": "2000-01-01T00:00:00.000Z",
        "address": "Shanghai Pudong ccc",
        "description": "test",
        "latitude": "41.1000000",
        "longitude": "120.1000000",
        "createdAt": "2022-03-06T14:45:27.000Z",
        "updatedAt": "2022-03-06T15:10:35.000Z",
        "deletedAt": null
      };
    });
  });

  it('should return new user', () => {
    return app.httpRequest().post('/user').type('form').send({
      "name": "test001",
      "pwd": "QWEqwe123!@#",
      "dob": "2000-01-01",
      "address": "Shanghai Pudong",
      "description": "a test user",
      "latitude": 41.1,
      "longitude": 120.1
    })
      .expect(200)
      .then((response) => {
        const { body } = response;
        assert(body.status, 'success');
        assert(body.body.user.id, 1);
        assert(body.body.user.name, 'test001');
      });
  });

  it('should throw same name error', () => {
    return app.httpRequest().post('/user').type('form').send({
      "name": "sameUser",
      "pwd": "QWEqwe123!@#",
      "dob": "2000-01-01",
      "address": "Shanghai Pudong",
      "description": "a test user",
      "latitude": 41.1,
      "longitude": 120.1
    })
      .expect(200)
      .then((response) => {
        const { body } = response;
        assert(body.status, 'error');
        assert(body.error, 'new name has been used by others');
      });
  });

  it('should throw validate error -- name', () => {
    return app.httpRequest().post('/user').type('form').send({
      "name": "a",
      "pwd": "QWEqwe123!@#",
      "dob": "2000-01-01",
      "address": "Shanghai Pudong",
      "description": "a test user",
      "latitude": 41.1,
      "longitude": 120.1
    })
      .expect(200)
      .then((response) => {
        const { body } = response;
        assert(body.status, 'error');
        assert(body.error, '[Field] name [code] invalid [message] userName should only includes a-Z0-9_- and in length 4-16');
      });
  });

  it('should throw validate error -- password', () => {
    return app.httpRequest().post('/user').type('form').send({
      "name": "test001",
      "pwd": "123456",
      "dob": "2000-01-01",
      "address": "Shanghai Pudong",
      "description": "a test user",
      "latitude": 41.1,
      "longitude": 120.1
    })
      .expect(200)
      .then((response) => {
        const { body } = response;
        assert(body.status, 'error');
        assert(body.error, '[Field] pwd [code] invalid [message] password should includes uppercase letters, lowercase letters, numbers and special characters');
      });
  });

  it('should get user by id', () => {
    const token = app.jwt.sign({
      id: 1,
      name: 'test001'
    }, 'wiredcraft', { expiresIn: '1d' });
    return app.httpRequest().get('/user/1')
      .set('token', token)
      .expect(200)
      .then((response) => {
        const { body } = response;
        console.log('body:', body);
        const user = body.body.user;
        assert(body.status, 'success');
        assert(user.id, 1);
        assert(user.name, 'test001');
      });
  });
});
