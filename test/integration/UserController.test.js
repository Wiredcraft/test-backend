var request = require('supertest');
var helper = require('./helper');
var agent;

describe('UserController', function() {
  describe('#find()', function() {
    before(function (done) {
      helper.login(function(_agent){
        agent = _agent;
        done();
      });
    });

    it('should return user list', function (done) {
      agent
        .get('/user')
        .expect(200)
        .expect('Content-Type', /json/, done);
      });
    });
});
