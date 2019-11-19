const assert = require('assert');
const supertest = require('supertest');
const sinon = require('sinon');
const app = require('../../server/app');
const User = require('../../server/models/user');
const util = require('../util');

const agent = supertest.agent(app);

describe('Auth api', () => {
  const password = 'xpassword';
  const user = {
    isAdmin: false,
    'address': 'earth',
    'description': 'I am one punch man',
    'name': 'tester-xxx1',
    'password': password,
    'salt': 'xsalt',
    'dob': new Date('2019-11-15T00:00:00.000Z'),
    'createdAt': parseInt(Date.now() / 1000),
    'location': [
      108.0221,
      24.74928
    ]
  };
  // sign in
  describe('POST /signin', function () {
    before(async function () {
      await User.addUser(user);
    });

    after(done => {
      User.deleteOne({ 'name': user.name }, done);
    });

    it('should response success with 200 status', done => {
      agent
        .post('/signin')
        .type('json')
        .send({ username: user.name, password: password })
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
          assert.ok(typeof data.token === 'string');
          done();
        });
    });
    it('should response 400 with invalid username and password', done => {
      agent
        .post('/signin')
        .type('json')
        .send({ username: '', password: '' })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          assert.equal(res.status, 400);
          res.body.should.be.json;
          const body = res.body;
          assert.equal(body.code, 10400);
          done();
        });
    });
    it('should response 400 with user not found', done => {
      agent
        .post('/signin')
        .type('json')
        .send({ username: 'somebody-xx', password: password })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          assert.equal(res.status, 400);
          res.body.should.be.json;
          const body = res.body;
          assert.equal(body.code, 10404);
          done();
        });
    });
    it('should response 401 with invalid password', done => {
      agent
        .post('/signin')
        .type('json')
        .send({ username: user.name, password: 'somepassword' })
        .expect(401)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          assert.equal(res.status, 401);
          res.body.should.be.json;
          const body = res.body;
          assert.equal(body.code, 10401);
          done();
        });
    });
  });


  // sign up
  describe('POST /signup', function () {
    after(done => {
      User.deleteOne({ 'name': user.name }, done);
    });
    it('should response 400 with invalid username or password', done => {
      agent
        .post('/signup')
        .type('json')
        .send({ username: '', password: '' })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          res.body.should.be.json;
          const body = res.body;
          assert.equal(body.code, 10400);
          done();
        });
    });
    it('should response 400 with input password and confirm must be consistent', done => {
      const payload = Object.assign({}, user);
      // payload.confirm = user.password;
      payload.username = user.name;
      agent
        .post('/signup')
        .type('json')
        .send(payload)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          res.body.should.be.json;
          const body = res.body;
          assert.equal(body.code, 11400);
          done();
        });
    });
    it('should response success with 200 status', done => {
      const payload = Object.assign({}, user);
      payload.confirm = user.password;
      payload.username = user.name;
      agent
        .post('/signup')
        .type('json')
        .send(payload)
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
    it('should response 400 with user exits', done => {
      const payload = Object.assign({}, user);
      payload.confirm = user.password;
      payload.username = user.name;
      agent
        .post('/signup')
        .type('json')
        .send(payload)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          res.body.should.be.json;
          const body = res.body;
          assert.equal(body.code, 12400);
          done();
        });
    });
    // it('should response 400 with invalid username and password', done => {
    //   agent
    //     .post('/signin')
    //     .type('json')
    //     .send({ username: '', password: '' })
    //     .expect(400)
    //     .end((err, res) => {
    //       if (err) {
    //         return done(err);
    //       }

    //       assert.equal(res.status, 400);
    //       res.body.should.be.json;
    //       const body = res.body;
    //       assert.equal(body.code, 10400);
    //       done();
    //     });
    // });
    // it('should response 400 with user not found', done => {
    //   agent
    //     .post('/signin')
    //     .type('json')
    //     .send({ username: 'somebody-xx', password: password })
    //     .expect(400)
    //     .end((err, res) => {
    //       if (err) {
    //         return done(err);
    //       }

    //       assert.equal(res.status, 400);
    //       res.body.should.be.json;
    //       const body = res.body;
    //       assert.equal(body.code, 10404);
    //       done();
    //     });
    // });
    // it('should response 401 with invalid password', done => {
    //   agent
    //     .post('/signin')
    //     .type('json')
    //     .send({ username: user.name, password: 'somepassword' })
    //     .expect(401)
    //     .end((err, res) => {
    //       if (err) {
    //         return done(err);
    //       }

    //       assert.equal(res.status, 401);
    //       res.body.should.be.json;
    //       const body = res.body;
    //       assert.equal(body.code, 10401);
    //       done();
    //     });
    // });
  });
});
