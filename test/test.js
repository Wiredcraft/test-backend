'use strict';

var supertest = require('supertest');
var should = require('should');

var request = supertest.agent('http://localhost:3000/api');

var userId = 1;

describe('POST /users', function() {
  it('should create an user successfully', function(done) {
    request
      .post('/users')
      .send({
        'id': userId,
        'name': 'fred',
        'dob': '1997-08-01',
        'address': 'test',
        'description': 'desc',
        'created_at': '2017-07-15',
      })
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        done();
      });
  });
});

describe('GET /users/:id', function() {
  it('should retrieve the user information back successfully', function(done) {
    request
      .get('/users/' + userId)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        res.body.name.should.equal('fred');
        res.body.dob.should.equal('1997-08-01');
        res.body.address.should.equal('test');
        res.body.description.should.equal('desc');
        res.body.created_at.should.equal('2017-07-15');
        done();
      });
  });
});

describe('PUT /users/:id', function() {
  it('should update user information successfully', function(done) {
    request
      .put('/users/' + userId)
      .send({
        'address': 'TEST ADDR',
        'description': 'TEST DESC',
      })
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        res.body.address.should.equal('TEST ADDR');
        res.body.description.should.equal('TEST DESC');
        done();
      });
  });
});

describe('DELETE /users/:id', function() {
  it('should delete user successfully', function(done) {
    request
      .delete('/users/' + userId)
      .send()
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        res.body.count.should.equal(1);
        done();
      });
  });
});
