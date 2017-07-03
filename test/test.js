/*
* @Author: alutun
* @Date:   2017-07-03 14:01:38
* @Last Modified by:   alutun
* @Last Modified time: 2017-07-03 16:19:16
*/

var supertest = require("supertest");
var should = require("should");
var dateFormat = require('dateformat');
var now = new Date();
var util = require('util');

var server = supertest.agent("http://localhost:3000");

var savedId;
// UNIT test begin

describe("Basic test",function(){
  it("should return home page",function(done){
    // Test home page API
    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      done();
    });
  });

  it("Should return 404 for wrong endpoint", function(done){
  	server
  	.get("/random")
    .expect(404)
    .end(function(err,res){
      res.status.should.equal(404);
      done();
  	});
   });
});

describe("PUT /user",function(){

	it("Simple Put Test", function(done){
		server
		.post("/user")
	 	.send({name: "toto", dob: dateFormat(now, "isoDateTime"), address: "Shanghai", description: "This user is a test"})
		.expect("Content-type",/json/)
	    .expect(200)
	    .end(function(err,res){
	      res.status.should.equal(200);
	      // console.log("res body is : " + util.inspect(res.body));
	      res.body.name.should.equal("toto");
	      res.body.description.should.equal("This user is a test");
	      res.body.address.should.equal("Shanghai");
	      res.body.should.have.property("id").which.is.a.Number();
	      savedId = res.body.id;
	      console.log("Saved ID is : " + savedId);
	      res.body.should.have.property("createdAt");
	      res.body.should.have.property("updatedAt");
	      res.body.should.have.property("dob");
	      done();
		});
	});


	it("Test mandatory field : name", function(done){
		server
		.post("/user")
		.send({dob: dateFormat(now, "isoDateTime"), address: "Shanghai", description: "This user is a test"})
		.expect("Content-type",/json/)
	    .expect(422)
	    .end(function(err,res){
	     res.status.should.equal(422);
	     done();
  		});
  	});

	it("Test mandatory field : dob", function(done){
		server
		.post("/user")
		.send({name: "titi", address: "Shanghai", description: "This user is a test"})
		.expect("Content-type",/json/)
	    .expect(422)
	    .end(function(err,res){
	     res.status.should.equal(422);
	     done();
  		});
  	});

  	it("Test mandatory field : address", function(done){
		server
		.post("/user")
		.send({name: "tutu", dob: dateFormat(now, "isoDateTime"), description: "This user is a test"})
		.expect("Content-type",/json/)
	    .expect(422)
	    .end(function(err,res){
	     res.status.should.equal(422);
	     done();
  		});
  	});

  	it("Test Optional and default value field : description", function(done){
		server
		.post("/user")
		.send({name: "tata", dob: dateFormat(now, "isoDateTime"), address: "Paris"})
		.expect("Content-type",/json/)
	    .expect(200)
	    .end(function(err,res){
	     res.status.should.equal(200);
	      res.body.name.should.equal("tata");
	      res.body.address.should.equal("Paris");
	      res.body.description.should.equal("NA");
	      res.body.should.have.property("id").which.is.a.Number();
	      res.body.should.have.property("createdAt");
	      res.body.should.have.property("updatedAt");
	      res.body.should.have.property("dob");
	     done();
  		});
  	});

	describe("PUT /user - Name field rules",function(){
		it("Test Name Min lenght", function(done){
			server
			.post("/user")
		 	.send({name: "ab", dob: dateFormat(now, "isoDateTime"), address: "Shanghai", description: "This user is a test"})
			.expect("Content-type",/json/)
		    .expect(422)
		    .end(function(err,res){
		      res.status.should.equal(422);
		      done();
			});
		});
		it("Test Name Max lenght", function(done){
			server
			.post("/user")
		 	.send({name: "Hello my name is way to long to be a correct name, so this will fail", dob: dateFormat(now, "isoDateTime"), address: "Shanghai", description: "This user is a test"})
			.expect("Content-type",/json/)
		    .expect(422)
		    .end(function(err,res){
		      res.status.should.equal(422);
		      done();
			});
		});
	});

	describe("PUT /user - Name field should be unique",function(){
		it("Test Name Min lenght", function(done){
			server
			.post("/user")
		 	.send({name: "tata", dob: dateFormat(now, "isoDateTime"), address: "Shanghai", description: "This user is a test"})
			.expect("Content-type",/json/)
		    .expect(422)
		    .end(function(err,res){
		      res.status.should.equal(422);
		      done();
			});
		});
	});
});

describe("PATCH /user/{id} ",function(){
	it("Test Update existing user", function(done){
		server
		.patch("/user/" + savedId)
	 	.send({name: "tyty", address: "Tokyo", description: "This user is a test and has been updated"})
		.expect("Content-type",/json/)
	    .expect(200)
	    .end(function(err,res){
	     res.status.should.equal(200);
	      res.body.name.should.equal("tyty");
	      res.body.address.should.equal("Tokyo");
	      res.body.description.should.equal("This user is a test and has been updated");
	      res.body.id.should.equal(savedId);
	      res.body.should.have.property("createdAt");
	      res.body.should.have.property("updatedAt");
	      res.body.should.have.property("dob");
	     done();
		});
	});
	it("Test Update existing user with an existing name", function(done){
		server
		.patch("/user/" + savedId)
	 	.send({name: "tata", address: "Tokyo", description: "This user is a test and has been updated"})
		.expect("Content-type",/json/)
	    .expect(422)
		 .end(function(err,res){
		    res.status.should.equal(422);
		  done();
		});
	});
});

describe("GET /user/{id} ",function(){
	it("Test Get existing user", function(done){
		server
		.get("/user/" + savedId)
	 	.send()
		.expect("Content-type",/json/)
	    .expect(200)
	    .end(function(err,res){
	     res.status.should.equal(200);
	      res.body.name.should.equal("tyty");
	      res.body.address.should.equal("Tokyo");
	      res.body.description.should.equal("This user is a test and has been updated");
	      res.body.id.should.equal(savedId);
	      res.body.should.have.property("createdAt");
	      res.body.should.have.property("updatedAt");
	      res.body.should.have.property("dob");
	     done();
		});
	});
	it("Test Get Non existing user", function(done){
		server
		.get("/user/" + 1337)
	 	.send()
		.expect("Content-type",/json/)
	    .expect(404)
	     .end(function(err,res){
		    res.status.should.equal(404);
		  done();
		});
	});
});

describe("DELETE /user/{id} ",function(){
	it("Test Delete existing user", function(done){
		server
		.delete("/user/" + savedId)
	 	.send()
		.expect("Content-type",/json/)
	    .expect(200)
	    .end(function(err,res){
	     res.status.should.equal(200);
	     res.body.count.should.equal(1);
	     done();
		});
	});
	it("Test Delete un-existing user", function(done){
		server
		.delete("/user/" + savedId)
	 	.send()
		.expect("Content-type",/json/)
	    .expect(200)
	    .end(function(err,res){
	     res.status.should.equal(200);
	     res.body.count.should.equal(0);
	     done();
		});
	});
});






