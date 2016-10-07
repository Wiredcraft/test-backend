'use strict';

var request = require('supertest');

describe('CORS', function () {
  var docs, app;

  before(function () {
    docs = [];
    app = request(wct.app);
  });

  it('OPTIONS /data/user expect CORS headers', function(done) {
    app
      .options('/data/user')
      .expect(204)
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
      .end(done);
  });

  it('GET /data/user/:id expect CORS headers', function (done) {
    app
      .options('/data/user/123')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
      .end(done);
  });

  it('PUT /data/user/:id expect CORS headers', function (done) {
    app
      .options('/data/user/123')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
      .end(done);
  });

  it('POST /data/user/:id expect CORS headers', function (done) {
    app
      .options('/data/user/123')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
      .end(done);
  });
});


describe('Authentication', function () {
  var app, token;

  before(function () {
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9uIjp7InVzZXIiOlsiR0VUIiwiUFVUIiwiUE9TVCIsIkRFTEVURSJdfSwiaWF0IjoxNDc1ODE2NDY0LCJleHAiOjE0NzU5MDI4NjQsImF1ZCI6InVzZXI6NjUwYWE5NzUxNzk4MzE4ODA4Yzk5ZjhjYWIwMDJmNDUiLCJpc3MiOiJ3aXJlZGNyYWZ0LXRlc3QifQ.aXjrgraST8Q79zhYMeDqPc33IJoSZxju0jGSQdmUb50';
    app = request(wct.app);
  });

  it('Authentication /data/user no authorization header', function (done) {
    app
      .get('/data/user')
      .expect(401)
      .expect(function(res) {
        var data = res.body;
        data.should.have.keys(['error']);
        data.error.should.be.eq('Missing authorization header');
      })
      .end(done);
  });

  it('Authentication /data/user wrong authorization header', function (done) {
    app
      .get('/data/user')
      .set('Authorization', 'MyBearerToken ' + token)
      .expect(401)
      .expect(function (res) {
        var data = res.body;
        data.should.have.keys(['error']);
        data.error.should.be.eq('Authorization header should be Bearer token');
      })
      .end(done);
  });

  it('Authentication /data/user invalid jwt token', function (done) {
    app
      .get('/data/user')
      .set('Authorization', 'Bearer ' + token.substr(0, token.length - 1))
      .expect(401)
      .expect(function (res) {
        var data = res.body;
        data.should.have.keys(['error']);
        data.error.should.be.eq('Json web token verification error');
      })
      .end(done);
  });
});