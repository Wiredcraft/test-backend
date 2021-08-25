const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../database/models/user');
const app = require('../app');

chai.should();

chai.use(chaiHttp);
describe('Access to DB', () => {
  describe('Access to DB', () => {
    it('should connected to mongoose', (done) => {
      app.mongoose.connection.on('connected', () => {
        done();
      });
    });
  });
  describe('App', () => {
    it('should list ALL user on /api/user GET', (done) => {
      chai.request(app)
        .get('/api/user')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.code.should.equal(0);
          res.body.result.data.should.be.a('array');
          res.body.result.data[0].should.have.property('_id');
          res.body.result.data[0].should.have.property('name');
          res.body.result.data[0].should.have.property('dob');
          res.body.result.data[0].should.have.property('address');
          res.body.result.data[0].should.have.property('description');
          res.body.result.data[0].should.have.property('createdAt');
          done();
        });
    });

    it('should list a SINGLE user on /api/user/:id GET', (done) => {
      const newUser = new User({
        name: 'HaoHaoP',
        dob: new Date().valueOf(),
        address: 'Shanghai',
        description: 'In Shanghai',
        createdAt: new Date().valueOf(),
      });
      newUser.save(function(err, data) {
        chai.request(app)
          .get('/api/user/' + data._id)
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.code.should.equal(0);
            response.body.result.data.should.be.a('array');
            response.body.result.data[0].should.have.property('_id');
            response.body.result.data[0].should.have.property('name');
            response.body.result.data[0].should.have.property('dob');
            response.body.result.data[0].should.have.property('address');
            response.body.result.data[0].should.have.property('description');
            response.body.result.data[0].should.have.property('createdAt');
            done();
          });
      });
    });

    it('should add a SINGLE user on /api/user PUT', (done) => {
      chai.request(app)
        .put('/api/user')
        .send({
          name: 'HaoHaoP',
          dob: new Date().valueOf(),
          address: 'Shanghai',
          description: 'In Shanghai',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.code.should.equal(0);
          done();
        });
    });

    it('should delete a SINGLE user on /api/user/:id DELETE', (done) => {
      chai.request(app)
        .get('/api/user')
        .end((err, res) => {
          chai.request(app)
            .delete('/api/user/' + res.body.result.data[res.body.result.data.length - 1]._id)
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.code.should.equal(0);
              done();
            });
        });
    });

    it('should update a SINGLE user on /api/user/:id POST', (done) => {
      chai.request(app)
        .get('/api/user')
        .end((err, res) => {
          chai.request(app)
            .post('/api/user/' + res.body.result.data[res.body.result.data.length - 1]._id)
            .send({
              name: 'HaoHaoP',
              dob: new Date().valueOf(),
              address: 'Shanghai',
              description: 'In Shanghai',
            })
            .end((error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.code.should.equal(0);
              done();
            });
        });
    });
  });
});
