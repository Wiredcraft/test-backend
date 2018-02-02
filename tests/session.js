const request = require('supertest');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const chai = require('chai');
const app = require('../index');
const config = require('../config');

const expect = chai.expect; // eslint-disable-line prefer-destructuring

chai.config.includeStack = true;

describe('## Auth APIs', () => {
  let token;
  const user = {
    username: `${+new Date()}`,
    name: 'Test',
    password: 'irrelevant'
  };
  let createdUser;

  before((done) => {
    request(app)
      .post(`${config.basePath}users`)
      .send(user)
      .end((err, res) => {
        createdUser = res.body;
        done();
      });
  });

  after((done) => {
    request(app)
      .delete(`${config.basePath}users/${createdUser.id}`)
      .set('Authorization', token)
      .end(() => {
        done();
      });
  });

  describe(`# POST ${config.basePath}sessions`, () => {
    it('should return Authentication error', (done) => {
      request(app)
        .post(`${config.basePath}sessions`)
        .send({
          username: 'notRegistered',
          password: 'IDontKnow'
        })
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Authentication error');
          done();
        })
        .catch(done);
    });

    it('should get valid JWT token', (done) => {
      request(app)
        .post(`${config.basePath}sessions`)
        .send({
          username: user.username,
          password: user.password
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
            expect(decoded.username).to.equal(user.username);
            token = `Bearer ${res.body.token}`;
            done();
          });
        })
        .catch(done);
    });
  });
});
