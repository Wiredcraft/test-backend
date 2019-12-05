//inside create_user_test.js
const chai = require('chai');
const expect = chai.expect;
const app = require('../btapp');
const udac = require('../dac/user_dac'); //imports the User data access controller.


describe('Users Data Access Controller', function() {
  
    describe('Retrieve list of users', () => {
        it('Get a listing of users', (done) => {
            udac.listusers()
                .then((user_list) => {
                    expect(user_list).to.be.an('array');
                    done();
                })
                .catch((err) => {
                    console.log('Error testing for the user list.' + err);
                });
        });
    });
});
