'use strict'
var request = require('supertest');
var app = require('../index.js');

function retrieveCookie(cookies) {
  var regex = /connect\.sid=(.*);/;
  var match;
  for (var i = 0, len = cookies.length; i < len; i++) {
    match = regex.exec(cookies[i]);
    if (match) {
      return match[1];
    }
  }

}
describe('POST /api/login', function() {
  it('should return 400 given invalid body', function(done) {
    request(app)
      .post('/api/login')
      .send({username: 'bob'})
      .expect(400)
      .end(done);
  });
  it('should return 401 given unmatched user/pwd pair', function(done) {
    request(app)
      .post('/api/login')
      .send({username: 'bob', password: 'secret'})
      .expect(401)
      .end(done);
  });
  it('should return 200 given valid user/pwd pair', function(done) {
    request(app)
      .post('/api/login')
      .send({username: 'alice', password: 'secret'})
      .expect(200)
      .end(done);
  });
  it('should return 401 given nonexistent user', function(done) {
    request(app)
      .post('/api/login')
      .send({username: 'tommy', password: 'anything'})
      .expect(401)
      .end(done);
  });
  it('should be able to access the resource after successful login', function(done) {
    request(app)
      .post('/api/login')
      .send({username: 'alice', password: 'secret'})
      .expect(200)
      .end(function(err, res) {
        if (err) { return done(err); }
        var cookie = retrieveCookie(res.header['Set-Cookie'] || res.header['set-cookie']);
        request(app)
          .get('/index')
          .set('Cookie', 'connect.sid=' + cookie)
          .expect(200)
          .end(done);
      });
  });
});
