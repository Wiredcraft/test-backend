const User = require('../app/models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Users SignIn', () => {
  describe('/POST users/login', () => {
    const user = {
      name: 'ahmed',
      password: '123456',
      description: 'software geek',
      dob: '1992/3/16',
      address: 'ALexandria, Egypt',
    };

    const invalidUser = {
      name: 'nouser',
      password: '123456',
    };

    before((done) => {
      User.create(user, (err) => {
        if (err) console.error(err);
        done();
      });
    });

    after((done) => {
      User.remove({}, () => {
        done();
      });
    });

    it('it should LOGIN an exist user', (done) => {
      chai.request(server)
        .post('/api/v1/users/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.success.should.be.eql(true);
          done();
        });
    });

    it('it should not LOGIN unknown user', (done) => {
      chai.request(server)
        .post('/api/v1/users/login')
        .send(invalidUser)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.success.should.be.eql(false);
          done();
        });
    });
  });
});
