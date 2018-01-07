const User = require('../app/models/user');
const jwt = require('../app/utils/jwt');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Users Authentication', () => {
  const user = {
    name: 'ahmed',
    password: '123456',
    description: 'software geek',
    dob: '1992/3/16',
    address: 'ALexandria, Egypt',
  };

  let userToken;
  let userID;
  // Create a new user
  before((done) => {
    User.create(user, (err, userObj) => {
      if (err) throw err;
      userID = userObj._id;
      userToken = jwt.generate({ username: userObj.name });
      done();
    });
  });

  after((done) => {
    User.remove({}, () => {
      done();
    });
  });

  describe('Valid Token', () => {
    it('it should GET all users', (done) => {
      chai.request(server)
        .get('/api/v1/users')
        .set('x-access-token', userToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('it should GET user by id', (done) => {
      chai.request(server)
        .get(`/api/v1/users/${userID}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('it should PUT a user', (done) => {
      chai.request(server)
        .put(`/api/v1/users/${userID}`)
        .set('x-access-token', userToken)
        .send({ description: 'new description' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.description.should.be.eql('new description');
          res.body.should.be.a('object');
          done();
        });
    });

    it('it should DELETE a user', (done) => {
      chai.request(server)
        .delete(`/api/v1/users/${userID}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  describe('Invalid Token', () => {
    const invalidToken = `${userToken}-invalid`;
    it('it should not GET all users', (done) => {
      chai.request(server)
        .get('/api/v1/users')
        .set('x-access-token', invalidToken)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('it should not GET user by id', (done) => {
      chai.request(server)
        .get(`/api/v1/users/${userID}`)
        .set('x-access-token', invalidToken)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('it should not PUT a user', (done) => {
      chai.request(server)
        .put(`/api/v1/users/${userID}`)
        .set('x-access-token', invalidToken)
        .send({ description: 'new description' })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('it should not DELETE a user', (done) => {
      chai.request(server)
        .delete(`/api/v1/users/${userID}`)
        .set('x-access-token', invalidToken)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
