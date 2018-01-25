var request = require('supertest');
var helper = require('./helper');
var agent;

describe('AuthController', function() {

  describe('#login()', function() {
    it('should login success', function (done) {
      request(sails.hooks.http.app)
        .post('/login')
        .send({ username: 'test', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(200, done);
      });

    it('should login failure without password', function (done) {
      request(sails.hooks.http.app)
        .post('/login')
        .send({ username: 'test' })
        .expect('Content-Type', /json/)
        .expect(400, done);
      });
  });

  describe('#signup()', function() {
    it('should signup success', function(done){
      var username = 'test2';
      var passsword = '123456';
      request(sails.hooks.http.app)
        .post('/signup')
        .send({ username: username, password: passsword })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
  describe('#current()', function() {
    it('should return 403', function(done){
      request(sails.hooks.http.app)
        .get('/current')
        .expect('Content-Type', /json/)
        .expect(401, done);
    });

    it('should return 200', function(done){
      helper.login(function(agent){
        agent
          .get('/current')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });

  });
});
