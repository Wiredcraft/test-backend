const assert = require('assert');
const supertest = require('supertest');
const sinon = require('sinon');
const app = require('../../server/app');
const User = require('../../server/models/user');
const util = require('../util');

const agent = supertest.agent(app);

describe('User api', () => {
  const headers = {};
  const user = {
    isAdmin: false,
    "address" : "earth",
    "description" : "I am one punch man",
    "name" : "tester-xxx",
    "password" : "xpassword",
    "salt" : "xsalt",
    "dob" : new Date("2019-11-15T00:00:00.000Z"),
    "createdAt" : parseInt(Date.now() / 1000),
    "location" : [ 
        108.0221, 
        24.74928
    ]
  };
  before(async function() {
    const result = await User.create(user);
    user._id = result._id;
    const token = util.getToken(user);
    headers['Authorization'] = 'Bearer ' + token;
  });

  after(done => {
    User.deleteOne({ 'name': user.name }, done);
  });

  describe('GET /users', function() {
    it('should response success with 200 status', done => {
      agent
        .set(headers)
        .get('/users')
        .query({ page: 1, pageSize: 20 })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          assert.equal(res.status, 200);
          res.body.should.be.json;
          const body = res.body;
          assert.equal(body.code, 0);
          const data = body.data;
          assert.ok(Array.isArray(data.list));
          assert.equal(data.page, 1);
          assert.equal(data.pageSize, 20);
          assert.ok(data.list.length);
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should response 500 with server error', done => {
      agent
        .set(headers)
        .get('/users/illegalId')
        .expect(500, done);
    });
    it('should response 200 with success', done => {
      agent
        .set(headers)
        .get('/users/' + user._id)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          assert.equal(res.status, 200);
          res.body.should.be.json;
          const body = res.body;
          assert.equal(body.code, 0);
          const data = body.data;
          assert.equal(user._id, data._id);
          done();
        });
    })
  });
});
