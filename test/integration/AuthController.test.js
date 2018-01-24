var request = require('supertest');

describe('AuthController', function() {

  describe('#login()', function() {
    it('should login success', function (done) {
      request(sails.hooks.http.app)
        .post('/auth/login')
        .send({ name: 'test', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(200, done);
      });
  });

  describe('#signup()', function() {
    it('should signup success', function(done){
      var name = 'test2';
      var passsword = '123456';
      request(sails.hooks.http.app)
        .post('/auth/signup')
        .send({ name: name, password: passsword })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
