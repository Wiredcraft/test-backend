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