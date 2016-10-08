'use strict';

var request = require('supertest');
var uuid = require('node-uuid');

describe('Users', function () {
  var app, token, adminId;

  before(function () {
    // setup fix document id
    adminId = '3168f669-0162-48d1-99fe-217fc45e27ab';

    app = request(wct.app);
  });

  beforeEach(function (done) {
    var db = wct.app.locals.nano.db;
    adminId = uuid.v4();
    wct.app.locals.nano.db.use('user').insert({
        "name": "admin",
        "dob": "2012-09-27",
        "address": "admin",
        "description": "admin"
      }, adminId).then(function () {
        app
          .get('/auth/token/' + adminId)
          .expect(function (response) {
            token = response.body.token;
          })
          .end(done);
      });
  });

  describe('POST', function () {
    it('POST /data/user 200 OK', function(done) {
      app
        .post('/data/user')
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json')
        .send({
          "name": "Zhang",
          "dob": "2012-09-27",
          "address": "12 avenue du General de Gaulle, 49000, ANGERS",
          "description": "Zhang is an awesome developer"
        })
        .expect(200)
        .expect(function (response) {
          var data = response.body;

          data['_id'].should.be.a('string');
          data['_id'].should.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);

          data['name'].should.be.a('string');
          data['dob'].should.be.a('string');

          wct.moment(data['dob'], 'YYYY-MM-DD').isValid().should.be.true;
          wct.moment(data['dob']).format('YYYY-MM-DD').should.be.eq('2012-09-27');

          data['address'].should.be.a('string');
          data['description'].should.be.a('string');

          data['created_at'].should.be.a('string');
          wct.moment(data['created_at'], 'ISO').isValid().should.be.true;
          var today = wct.moment().format('YYYY-MM-DD');
          wct.moment(data['created_at']).format('YYYY-MM-DD').should.be.eq(today);
        })
        .end(done);
    });

    it('POST /data/user 400 Bad Request', function (done) {
      app
        .post('/data/user')
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json')
        .send({
          "name": 'Zhang'
        })
        .expect(400)
        .expect(function (response) {
          var data = response.body;
          data.should.have.any.keys(['error']);

          data.error.should.eq('Document must have an address');
        })
        .end(done);
    });
  });

  describe('GET', function () {
    it('GET /data/user/:id 200 OK', function(done) {
      app
        .get('/data/user/' + adminId)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect(function (response) {
          var data = response.body;
          data.should.be.deep.eq({
            "_id": adminId,
            "name": "admin",
            "dob": "2012-09-27",
            "address": "admin",
            "description": "admin"
          })
        })
        .end(done);
    });
  });

  describe('PUT', function () {
    it('PUT /data/user/:id 200 OK', function (done) {
      app
        .put('/data/user/' + adminId)
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json')
        .expect(200)
        .send({
          "name": "Waiguoren",
          "address": "Yuyuan Road Shanghai",
          "description": "Waiguoren are Laowai and vice versa"
        }).expect(function (response) {
          var data = response.body;
          data['_id'].should.be.eq(adminId);
          data['name'].should.be.eq('Waiguoren');
          wct.moment(data['dob']).format('YYYY-MM-DD').should.be.eq('2012-09-27');
          data['address'].should.be.eq('Yuyuan Road Shanghai');
          data['description'].should.be.eq('Waiguoren are Laowai and vice versa');
        })
        .end(done);
    });
  });

  describe('DELETE', function () {
    it.skip('DELETE /data/user/:id 200', function (done) {

      app
        .delete('/data/user/' + doc._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect(function (response) {
          var data = response.body;
          data.should.be.a('object');
        })
        .end(done);
    });
  });
});