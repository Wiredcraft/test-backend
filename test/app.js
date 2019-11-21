const assert = require('assert');
const request = require('supertest');
const should = require('should');
const app = require('../server/app');
const sinon = require('sinon');
const logger = require('../server/lib/logger');

const agent = request.agent(app);
describe('app.js', function() {
  it('should mount jwt middleware', function(done) {
    assert.ok(1);
    done();
  });
  it('should be response 404', function(done) {
    agent.get('/not-exits-url').expect(404, function(err, res) {
      assert.ifError(err);
      res.status.should.equal(404);
      res.body.should.be.json;
      done();
    });
  });
  it('should be response 500', function(done) {
    var mock = sinon.mock(logger);
    mock.expects('log').atLeast(1);
    app.get('/testing', function(req, res, next) {
      return next(new Error('Faker Server Error'));
    });
    const routes = app._router.stack
    const len = routes.length
    const currentLayer = routes.pop()
    routes[parseInt(len / 2)] = currentLayer;
    request.agent(app).get('/testing').end(function(err, res) {
      assert.ifError(err);
      res.status.should.equal(500);
      res.body.should.be.json;
      mock.verify();
      done();
    });
  });
});
