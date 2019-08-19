var expect = require('chai').expect;

var User = require('./model');
var mocks = require('../../test-helpers/_mocks');
 
describe('User model', () => {
  it('should be invalid if basic data is empty', (done) => {
    var m = new User();

    m.validate((err) => {
      expect(err.errors.name).to.exist;
      done();
    });
  });

  it('should validate if all data is correct', (done) => {
    var m = new User({
      name: mocks.Chance.last(),
      type: "income"
    });

    m.validate((err) => {
      expect(err).to.null;
      done();
    });
  });

});
