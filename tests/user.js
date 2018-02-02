const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../index');
const config = require('../config');

const expect = chai.expect; // eslint-disable-line prefer-destructuring
chai.config.includeStack = true;

describe('## User APIs', () => {
  let token;
  const user = {
    username: `${+new Date()}@test.com`,
    name: 'Test',
    password: 'irrelevant'
  };
  let createdUser;

  describe(`# POST ${config.basePath}users`, () => {
    afterEach((done) => {
      request(app)
        .post(`${config.basePath}sessions`)
        .send(user)
        .end((err, res) => {
          token = `Bearer ${res.body.token}`;
          done();
        });
    });

    it('should create a new user', (done) => {
      request(app)
        .post(`${config.basePath}users`)
        .send(user)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.name).to.equal(user.name);
          createdUser = res.body;
          done();
        })
        .catch(done);
    });
    it('should get error for sending non especified values', (done) => {
      request(app)
        .post(`${config.basePath}users`)
        .send({ name: 'Non valid', nonEspecified: 'something' })
        .expect(httpStatus.BAD_REQUEST)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}users/:userId`, () => {
    it('should get user details', (done) => {
      request(app)
        .get(`${config.basePath}users/${createdUser.id}`)
        .set('Authorization', token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(user.name);
          done();
        })
        .catch(done);
    });
    it('should get error invalid token for that id', (done) => {
      request(app)
        .get(`${config.basePath}users/000000000000000000000001`)
        .set('Authorization', token)
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        })
        .catch(done);
    });
    it('should return Authentication error for lack of token', (done) => {
      request(app)
        .get(`${config.basePath}users/${createdUser.id}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}users/me`, () => {
    it('should get user details', (done) => {
      request(app)
        .get(`${config.basePath}users/me`)
        .set('Authorization', token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(user.name);
          done();
        })
        .catch(done);
    });
    it('should return Authentication error for lack of token', (done) => {
      request(app)
        .get(`${config.basePath}users/me`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe(`# PUT ${config.basePath}users/:userId`, () => {
    it('should get error for sending non especified values', (done) => {
      request(app)
        .put(`${config.basePath}users/${createdUser.id}`)
        .set('Authorization', token)
        .send({ name: 'Non valid', nonEspecified: 'something' })
        .expect(httpStatus.BAD_REQUEST)
        .then(() => {
          done();
        })
        .catch(done);
    });
    it('should update user details', (done) => {
      const newName = 'Another test';
      request(app)
        .put(`${config.basePath}users/${createdUser.id}`)
        .set('Authorization', token)
        .send({ name: newName })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(newName);
          done();
        })
        .catch(done);
    });
    it('should get error invalid token for that id', (done) => {
      request(app)
        .put(`${config.basePath}users/000000000000000000000001`)
        .set('Authorization', token)
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        })
        .catch(done);
    });
    it('should return Authentication error for lack of token', (done) => {
      request(app)
        .put(`${config.basePath}users/${createdUser.id}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe(`# PUT ${config.basePath}users/me`, () => {
    it('should get error for sending non especified values', (done) => {
      request(app)
        .put(`${config.basePath}users/me`)
        .set('Authorization', token)
        .send({ name: 'Non valid', nonEspecified: 'something' })
        .expect(httpStatus.BAD_REQUEST)
        .then(() => {
          done();
        })
        .catch(done);
    });
    it('should update user details', (done) => {
      const newName = 'Another more test';
      request(app)
        .put(`${config.basePath}users/me`)
        .set('Authorization', token)
        .send({ name: newName })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(newName);
          done();
        })
        .catch(done);
    });
    it('should return Authentication error for lack of token', (done) => {
      request(app)
        .put(`${config.basePath}users/me`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe(`# DELETE ${config.basePath}users/:userId`, () => {
    it('should get error invalid token for that id', (done) => {
      request(app)
        .delete(`${config.basePath}users/000000000000000000000001`)
        .set('Authorization', token)
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        })
        .catch(done);
    });
    it('should return Authentication error for lack of token', (done) => {
      request(app)
        .delete(`${config.basePath}users/${createdUser.id}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        })
        .catch(done);
    });
    it('should delete user', (done) => {
      request(app)
        .delete(`${config.basePath}users/${createdUser.id}`)
        .set('Authorization', token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.id).to.equal(createdUser.id);
          done();
        })
        .catch(done);
    });
    it('should get not found by trying to delete that user again', (done) => {
      request(app)
        .delete(`${config.basePath}users/me`)
        .set('Authorization', token)
        .expect(httpStatus.NOT_FOUND)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });
});
