'use strict';

var request = require('supertest');

describe('Users', function () {
  var app, server, docs;

  before(function (done) {
    wct.app.on('started', function () {
      app = request(wct.app);
      done();
    });

    docs = [];

    server = wct.app.start();
  });

  describe('POST', function () {
    it('POST /api/user 200 OK', function(done) {
      app
        .post('/api/user')
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
          data['id'].should.be.a('string');
          data['id'].should.match(/[0-9a-f]{32}/);

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

    it('POST /api/user 422 Unprocessable Entity', function (done) {
      app
        .post('/api/user')
        .set('Content-Type', 'application/json')
        .send({
          "name": 'Zhang'
        })
        .expect(422)
        .expect(function (response) {
          var data = response.body;
          data.should.have.any.keys(['error']);

          data.error.should.have.any.keys(['name', 'message']);
          data.error.name.should.eq('ValidationError');
          data.error.message.should.match(/^The `user` instance is not valid/);
        })
        .end(done);
    });
  });

  describe('GET', function () {
    it('GET /api/user/{id} 200 OK', function(done) {
      var doc = docs[0];
      doc.should.have.any.keys(['id']);

      app
        .get('/api/user/' + doc.id)
        .expect(200)
        .expect(function (response) {
          var data = response.body;
          data.should.be.deep.eq(doc)
        })
        .end(done);
    });
  });

  describe('PUT', function () {
    it('PUT /api/user 200 OK', function (done) {
      var doc = docs[0];
      doc.should.have.any.keys(['id']);

      app
        .put('/api/user/' + doc.id)
        .set('Content-Type', 'application/json')
        .expect(200)
        .send({
          "name": "Waiguoren",
          "address": "Yuyuan Road Shanghai",
          "description": "Waiguoren are Laowai and vice versa"
        }).expect(function (response) {
          var data = response.body;
          data['id'].should.be.eq(doc.id);
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
    it('DELETE /api/user 200', function (done) {
      var doc = docs[0];
      doc.should.have.any.keys(['id']);

      app
        .delete('/api/user/' + doc.id)
        .expect(200)
        .expect(function (response) {
          var data = response.body;
          data.should.be.a('array');
          data.length.should.be.gt(0);
        })
        .end(done);
    });
  });

  after(function (done) {
    server.on("close", function () {
      done();
    });

    server.close();
  });
});