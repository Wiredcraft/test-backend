const assert = require('assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/app');
const User = require('../../server/models/user');
const util = require('../util');

const agent = supertest.agent(app);

describe('User api', () => {
  const headers = {};
  const user = {
    isAdmin: false,
    address: 'earth',
    description: 'I am one punch man',
    name: 'tester-xxx1',
    password: 'password',
    salt: 'xsalt',
    dob: new Date('2019-11-15T00:00:00.000Z'),
    location: [
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
    });
  });
  describe('PUT /users/:id', () => {
    it('should response 500 with server error', done => {
      agent
        .set(headers)
        .get('/users/illegalId')
        .expect(500, done);
    });
    it('should response 404 with user not found', done => {
      const update = {
        address: 'new address' + Date.now(),
        description: Date.now()
      };
      const userId = mongoose.Types.ObjectId();
      agent
        .set(headers)
        .put('/users/' + userId)
        .send(update)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          assert.equal(res.status, 404);
          assert.equal(res.body.code, 10404);
          done();
        });
    });
    it('should response 401 with permission deny', async function() {
      const data = Object.assign({ }, user);
      data.name = 'newName' + Date.now();
      delete data._id;
      const newUser = await User.create(data);
      const res = await agent
        .set(headers)
        .put('/users/' + newUser._id)
        .send(data);

      assert.equal(res.status, 401);
      assert.equal(res.body.code, 11401);
      await newUser.remove();
    });
    it('should response 200 with success', done => {
      const update = {
        address: 'new address' + Date.now(),
        description: Date.now(),
        dob: new Date().toISOString(),
      };
      agent
        .set(headers)
        .put('/users/' + user._id)
        .send(Object.assign(user, update))
        .expect(200)
        .end(async function(err, res) {
          if (err) {
            return done(err);
          }

          assert.equal(res.status, 200);
           User.findById(user._id)
            .then(current => {
              assert.equal(current.address, update.address);
              assert.equal(current.description, update.description);
              assert.equal(res.body.code, 0);
              done();
            })
            .catch(done);
        });
    });
  });
  describe('DELETE /users/:id', () => {
    it('should response 500 with server error', done => {
      agent
        .set(headers)
        .get('/users/illegalId')
        .expect(500, done);
    });

    it('should response 404 with user not found', done => {
      const userId = mongoose.Types.ObjectId();
      agent
        .set(headers)
        .delete('/users/' + userId)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          assert.equal(res.status, 404);
          assert.equal(res.body.code, 10404);
          done();
        });
    });
    it('should response 401 with permission deny', async function() {
      const data = Object.assign({ }, user);
      data.name = 'newName' + Date.now();
      delete data._id;
      const newUser = await User.create(data);
      const res = await agent
        .set(headers)
        .put('/users/' + newUser._id)
        .send(data);

      assert.equal(res.status, 401);
      assert.equal(res.body.code, 11401);
      await newUser.remove();
    });

    it('should response 200 with success', done => {
      agent
        .set(headers)
        .delete('/users/' + user._id)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          assert.equal(res.status, 200);
          res.body.should.be.json;
          const body = res.body;
          assert.equal(body.code, 0);
          done();
        });
    });
  });
});
