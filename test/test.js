var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); //path to app.js or server.js
var tmp_id = 10;

describe('testAPI', function() {
  lt.beforeEach.withApp(app);

  //test POST
  lt.describe.whenCalledRemotely('POST', '/api/people',{
     name: "CCharlieLi",
     dob: "1991-05-08",
     address: "Beijing",
     description: "Student",
     created_at: "2015-08-31"
  }, function() {
    lt.it.shouldBeAllowed();
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
    });
    it('should respond with a new person', function() {
      assert.equal(this.res.body.name,"CCharlieLi");
    });
  });

    //test GET all
  lt.describe.whenCalledRemotely('GET', '/api/people', function() {
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
    });
    it('should respond with an array of people', function() {
      assert(Array.isArray(this.res.body));
    });
  });

      //test GET one
  lt.describe.whenCalledRemotely('GET', '/api/people/findOne', function() {
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
    });
    it('should respond with a person', function() {
      assert.equal(this.res.body.name,"CCharlieLi");
    });
  });

  //test PUT
  lt.describe.whenCalledRemotely('PUT', '/api/people/',{
     name: "CCharlieLi123",
     dob: "1991-05-18",
     address: "Shanghai",
     description: "GraduateStudent",
     created_at: "2015-10-31"
  }, function() {
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
    });
    it('should respond with a updated person', function() {
      assert.equal(this.res.body.name,"CCharlieLi123");
    });
  });

  //test DELETE
  //Have no idea how to get a id that is available
  lt.describe.whenCalledRemotely('DELETE', '/api/people/'+tmp_id, function() {
    it('should have statusCode 204', function() {
      assert.equal(this.res.statusCode, 204);
    });
    it('should respond with undefined', function() {
      assert.equal(this.res.body,undefined);
    });
  });

});