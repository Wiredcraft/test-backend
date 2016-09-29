'use strict';

var request = require('supertest');

describe('Users', function () {
  var app, server, docs;

  before(function () {
    app = request(wct.app);
    docs = [];
  });

  describe('POST', function () {
    it('POST /data/user 200 OK', function(done) {
      app
        .post('/data/user')
        .set('Content-Type', 'application/json')
        .send({
          "name": "Zhang",
          "dob": "2012-09-27",
          "address": "12 avenue du Général de Gaulle, 49000, ANGERS",
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

          docs.push(data);
        })
        .end(done);
    });

    it('POST /data/user 400 Bad Request', function (done) {
      app
        .post('/data/user')
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
      var doc = docs[0];
      doc.should.have.any.keys(['_id']);

      app
        .get('/data/user/' + doc._id)
        .expect(200)
        .expect(function (response) {
          var data = response.body;
          data.should.be.deep.eq(doc)
        })
        .end(done);
    });
  });

  describe('PUT', function () {
    it('PUT /data/user/:id 200 OK', function (done) {
      var doc = docs[0];
      doc.should.have.any.keys(['_id']);

      app
        .put('/data/user/' + doc._id)
        .set('Content-Type', 'application/json')
        .expect(200)
        .send({
          "name": "Waiguoren",
          "address": "Yuyuan Road Shanghai",
          "description": "Waiguoren are Laowai and vice versa"
        }).expect(function (response) {
          var data = response.body;
          data['_id'].should.be.eq(doc._id);
          data['name'].should.be.eq('Waiguoren');
          wct.moment(data['dob']).format('YYYY-MM-DD').should.be.eq('2012-09-27');
          data['address'].should.be.eq('Yuyuan Road Shanghai');
          data['description'].should.be.eq('Waiguoren are Laowai and vice versa');
          data['created_at'].should.be.eq(doc.created_at);
        })
        .end(done);
    });
  });

  describe('DELETE', function () {
    it.skip('DELETE /data/user/:id 200', function (done) {
      var doc = docs[0];
      doc.should.have.any.keys(['_id']);

      app
        .delete('/data/user/' + doc._id)
        .expect(200)
        .expect(function (response) {
          var data = response.body;
          data.should.be.a('object');
        })
        .end(done);
    });
  });

});