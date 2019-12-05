//inside create_user_test.js
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const app = require('../btapp');
const Users = require('../models/users'); //imports the User model.


describe('Users Access', function() {
    describe('Creating documents', () => {
        it('creates a user', (done) => {
            const user = new Users({ name: 'Captain Jean Luc Picard',
                                     dob: 810216104,
                                     address: 'USS Enterprise',
                                     description: 'Captain of the Enterprise and foil of Q' });
            user.save()
                .then((user) => {
                    expect(user.isNew).to.be.false;  //if user is saved to db it is not new
                    done();
                });
        });

        it('Prevent a duplicate user', (done) => {
            const user = new Users({ name: 'Commander Data',
                                     dob: 810216104,
                                     address: 'USS Eneterprise',
                                     description: 'First Android in Starfleet' });
            user.save()
                .then( () => {
                    done(new Error(('Expected method to reject')));
                })
                .catch((err) => {
                    assert.isDefined(err);
                    done();
                })
                .catch(done);
        });

        it('Remove a user', (done) => {
            const name =  'Commander Data';
            Users.estimatedDocumentCount()
                 .then((numUsers) => {


                Users.deleteMany({ name: { $ne: name} })
                     .then((result) => {
               
                        let remaining = numUsers - result.deletedCount;
                        expect(remaining).to.be.eq(1);
                        done();
                    })
                    .catch((err) => {
                        console.log('Received an error on deletion ' + err);
                    })
                    .catch(done);  
                });
           });
    });
});
