//inside create_user_test.js
const chai = require('chai');
const expect = chai.expect;
const app = require('../btapp');
const udac = require('../dac/user_dac'); //imports the User data access controller.


describe('Users Data Access Controller', function() {
  
    describe('Perform CRUD actions with users', () => {
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

        it('Get one user by id', (done) => {
            const userId = '5de88258976347576c2a965d';
            udac.getUserById(userId)
                .then((user) => {
                    expect(user.name).to.be.eq('Commander Data');
                    done();
                })
                .catch((err) => {
                    console.log('Error testing for the user list.' + err);
                });
        });

    });
});
