const User = require('../app/models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach((done) => {
    User.remove({}, () => {
      done();
    });
  });

  describe('/POST users', () => {
    it('it should POST a new user', (done) => {
      const user = {
        name: 'ahmed',
        password: '123456',
        description: 'software geek',
        dob: '1992/3/16',
        address: 'ALexandria, Egypt',
      };
      chai.request(server)
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.password.should.be.eql('xxxxxxxxxxxx');
          done();
        });
    });

    it('it should not POST a new user if name not in body', (done) => {
      const user = {
        password: '123456',
        description: 'software geek',
        dob: '1992/3/16',
        address: 'ALexandria, Egypt',
      };
      chai.request(server)
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should not POST a new user if password not in body', (done) => {
      const user = {
        name: 'biga',
        description: 'software geek',
        dob: '1992/3/16',
        address: 'ALexandria, Egypt',
      };
      chai.request(server)
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
