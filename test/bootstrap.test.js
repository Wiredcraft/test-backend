var sails = require('sails');
var fixtures = require('sails-fixtures');

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(5000);

  sails.lift({
    // configuration for testing purposes
  }, function(err) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    fixtures.init({
      'dir':'./test/fixtures/',
      'pattern':'*.json' // Default is '*.json'
    }, done);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
