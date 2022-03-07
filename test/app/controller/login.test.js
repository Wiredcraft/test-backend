'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/controller/login.test.js', () => {
  before(() => {
    app.mockService('login', 'login', (name, pwd) => {
      if (name === 'user' && pwd === 'pwd123') {
        return {
          "id": 7,
          "name": "user",
          "dob": "2000-01-01T00:00:00.000Z",
          "address": "Shanghai Pudong",
          "description": "a test user",
          "latitude": 41.1,
          "longitude": 120.1,
          "createdAt": "2022-03-07T07:01:51.000Z"
        };
      } else {
        return null;
      }
    });
  });

  it('should return token', () => {
    return app.httpRequest().post('/login').type('form').send({
      name: 'user',
      pwd: 'pwd123'
    })
      .expect(200)
      .then((response) => {
        const { body } = response;
        assert(body.status, 'success');
        assert(body.body.user.id, 1);
        assert.notEqual(body.body.token, '');
      });
  });

  it('should return login failed', () => {
    return app.httpRequest().post('/login').type('form').send({
      name: 'user',
      pwd: 'error password'
    })
      .expect(200)
      .then((response) => {
        const { body } = response;
        assert(body.status, 'error');
        assert(body.error, 'name or password wrong');
      });
  });
});
