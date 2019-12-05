//inside create_user_test.js
const chai = require('chai');
const expect = chai.expect;
const app = require('../btapp');
const udac = require('../dac/user_dac'); //imports the User data access controller.


describe('Users Data Access Controller', function() {
  
    describe('Perform CRUD actions with users', () => {
        it('TEST: Get a listing of users', (done) => {
            udac.listusers()
                .then((user_list) => {
                    expect(user_list).to.be.an('array');
                    done();
                })
                .catch((err) => {
                    console.log('Error testing for the user list.' + err);
                });
        });

        it('TEST: Get one user by id', (done) => {
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

        it('TEST: Get one user with data parameters', (done) => {
            let check_date = new Date(810216104);
            const data= {'name': 'Commander Data',
                         'dob': check_date,
                         'address': 'USS Enterprise'};

            udac.getUserByData(data)
                .then((user) => {
                    expect(user.description).to.include('Android');
                    done();
                })
                .catch((err) => {
                    console.log('Error testing getUserByData.' + err);
                });
        });

        it('TEST: Do not get non-existant user', (done) => {
            let check_date = new Date(810216104);
            const data= {'name': 'Doctor Who',
                         'dob': check_date,
                         'address': 'USS Enterprise'};

            udac.getUserByData(data)
                .then((user) => {
                    expect(user).to.be.null;
                    done();
                })
                .catch((err) => {
                    console.log('Error testing getting user that does not exist.' + err);
                });
        });

        it('TEST: Create a user with data', (done) => {
            let check_date = new Date(945544774469);
            const data= {'name': 'Elim Garak',
                         'dob': check_date,
                         'address': 'Deep Space Nine'};

            udac.addNewUser(data)
                .then((user) => {
                    expect(user.isNew).to.be.false;
                    done();
                })
                .catch((err) => {
                    console.log('Error testing creating a new user.' + err);
                });
        });

        it('TEST: Do not Add a duplicate', (done) => {
            let check_date = new Date(945544774469);
            const data= {'name': 'Elim Garak',
                         'dob': check_date,
                         'address': 'Deep Space Nine'};

            udac.addNewUser(data)
                .then((user) => {
                    expect(user).to.be.undefined;
                    done();
                })
                .catch((err) => {
                    console.log('Error testing creating a new user.' + err);
                });
        });
    });
});
