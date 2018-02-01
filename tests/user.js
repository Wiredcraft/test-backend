const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../index');
const config = require('../config');

const expect = chai.expect; // eslint-disable-line prefer-destructuring
chai.config.includeStack = true;

describe('## User APIs', () => {
  const user = {
    name: 'Test',
  };
  let createdUser;

  describe(`# POST ${config.basePath}users`, () => {
    it('should create a new user', (done) => {
      request(app)
        .post(`${config.basePath}users`)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(user.name);
          createdUser = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}users/:userId`, () => {
    it('should get user details', (done) => {
      console.log('createdUser', createdUser);
      request(app)
        .get(`${config.basePath}users/${createdUser.id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(user.name);
          done();
        })
        .catch(done);
    });
  });

  describe(`# PUT ${config.basePath}users/:userId`, () => {
    it('should update user details', (done) => {
      const newName = 'Another test';
      request(app)
        .put(`${config.basePath}users/${createdUser.id}`)
        .send({ name: newName })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(newName);
          done();
        })
        .catch(done);
    });
  });

  describe(`# DELETE ${config.basePath}users/:userId`, () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`${config.basePath}users/${createdUser.id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.id).to.equal(createdUser.id);
          done();
        })
        .catch(done);
    });
  });
});
