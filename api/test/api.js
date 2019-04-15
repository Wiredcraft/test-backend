var supertest = require("supertest");
var should = require("should");
var api = require('../api.js');

// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("Testing the user api",function(){

  // #1 should return home page
  it("should return home page",function(done){
    // calling home page api
    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      api.close();
      done();
    });
  });

});
