const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../database/models/user');
const app = require('../app');

chai.should();

chai.use(chaiHttp);

describe('App', () => {

  before((done) => {
    app.mongoose.connection.on('connected', () => {
      done();
    });
  });

  it('should list ALL user on /api/user GET', (done) => {
    chai.request(app)
      .get('/api/user')
      .then((res) => {
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

  it('should get a SINGLE user on /api/user/:id GET', (done) => {
    const newUser = new User({
      name: 'HaoHaoP',
      dob: new Date().valueOf(),
      address: 'Shanghai',
      description: 'In Shanghai',
      createdAt: new Date().valueOf(),
    });
    newUser.save()
      .then(data => {
        return chai.request(app).get('/api/user/' + data._id)
      })
      .then((res) => {
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

  it('should add a SINGLE user on /api/user POST', (done) => {
    chai.request(app)
      .post('/api/user')
      .send({
        name: 'HaoHaoP',
        dob: new Date().valueOf(),
        address: 'Shanghai',
        description: 'In Shanghai',
      })
      .then((res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.code.should.equal(0);
        done();
      });
  });

  it('should delete a SINGLE user on /api/user/:id DELETE', (done) => {
    const newUser = new User({
      name: 'HaoHaoP',
      dob: new Date().valueOf(),
      address: 'Shanghai',
      description: 'In Shanghai',
      createdAt: new Date().valueOf(),
    });
    newUser.save()
      .then(data => {
        return chai.request(app).delete('/api/user/' + data._id)
      })
      .then((res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.code.should.equal(0);
        done();
      });
  });

  it('should update a SINGLE user on /api/user/:id PUT', (done) => {
    const newUser = new User({
      name: 'HaoHaoP',
      dob: new Date().valueOf(),
      address: 'Shanghai',
      description: 'In Shanghai',
      createdAt: new Date().valueOf(),
    });
    newUser.save()
      .then(data => {
        return chai.request(app)
          .put('/api/user/' + data._id)
          .send({
            name: 'Edit HaoHaoP',
            dob: new Date().valueOf(),
            address: 'Edit Shanghai',
            description: 'Edit In Shanghai',
          });
      })
      .then((res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.code.should.equal(0);
        done();
      });
  });
});