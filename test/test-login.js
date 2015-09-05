var request = require('supertest');
var app = require('../index.js');

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
});
