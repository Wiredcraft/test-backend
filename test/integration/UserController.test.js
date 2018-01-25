var request = require('supertest');
var helper = require('./helper');
var agent;
var adminAgent;

describe('UserController', function() {

  before(function (done) {
    helper.login(function(_agent){
      agent = _agent;
      done();
    });
  });

  describe('#find()', function() {
    it('should return user list', function (done) {
      agent
        .get('/user')
        .expect(200)
        .expect('Content-Type', /json/, done);
      });
    });

  describe('#findOne()', function() {
    it('should return user instance', function (done) {
      agent
        .get('/user/1')
        .expect(200)
        .expect('Content-Type', /json/, done);
      });
    });

  describe('#destroy()', function() {
    it('should return 403 without admine permisson', function (done) {
      agent
        .delete('/user/1')
        .expect(403)
        .expect('Content-Type', /json/, done);
    });

    before(function (done) {
      helper.admin(function(_admin){
        adminAgent = _admin;
        done();
      });
    });
    it('should return 200 with admin role', function (done) {
      adminAgent
        .delete('/user/3')
        .expect(200)
        .expect('Content-Type', /json/, done);
      });
    });

});
