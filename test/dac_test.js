//inside create_user_test.js
const chai = require('chai');
const expect = chai.expect;
const app = require('../btapp');
const udac = require('../controllers/data_access_controller'); //imports the User data access controller.


describe('Users Data Access Controller', function() {
  
    describe('Perform CRUD actions with users', () => {

        before(() => {
            const data = {'name': { $ne: 'Commander Data'}};

            udac.removeUsersByCriteria(data)
                .then((result) => {
                    console.log("Database reset....");
                })
                .catch((err) => {
                    console.log('Error testing creating a new user.' + err);
                    expect(err).is.defined
                });
        });

        it('TEST: Get a listing of users', (done) => {
            udac.listUsers()
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

        it('TEST: Do not Add an incomplete user', (done) => {
            let check_date = new Date(1145544774469);
            const data= {'name': 'Wesley Crusher',
                         'dob': check_date};

            udac.addNewUser(data)
                .then((user) => {
                    expect(user).to.be.undefined;
                    done();
                })
                .catch((err) => {
                    console.log('Error testing creating a new user.' + err);
                });
        });

        it('TEST: create multiple users',(done) => {
            let users = [{'name': "Captain Benjamin Sisko",
                          'dob': new Date(1135544774469),
                          'address': "Deep Space Nine"},
                          {'name': "Commandeer William Ryker", 
                          'dob': new Date(1045544774469),
                          'address': "USS Enterprise"},
                          {'name': "Ensign Ro Laren", 
                          'dob': new Date(1345544774469),
                          'address': "USS Enterprise"},
                          {'name': "Lt. Cmdr Worf", 
                          'dob': new Date(985544774469),
                          'address': "Deep Space Nine"}];

            udac.addNewUser(users)
                .then((users) => {
                    expect(users).to.be.an('array').to.have.lengthOf(4);
                    done();
                })
                .catch((err) => {
                    console.log('Error testing adding multiple users.' + err);
                });
        });

        it('TEST: Updating a user', (done) => {
            let check_date = new Date(1145544774469);
            const data = {'name': 'Elim Garak',
                         'address': 'Deep Space Nine'};

            const new_data = {'address': 'Cardassia'};

            udac.updateUser(data, new_data)
                .then((user) => {
                    expect(user.address).to.be.eq('Cardassia');
                    done();
                })
                .catch((err) => {
                    console.log('Error testing creating a new user.' + err);
                });
        });

        it('TEST: Not updating when multiple users found', (done) => {
            const data = {'address': 'Deep Space Nine'};

            const new_data = {'address': 'Bajor'};

            udac.updateUser(data, new_data)
                .then((user) => {
                    expect(user).to.be.undefined;
                    done();
                })
                .catch((err) => {
                    console.log('Error testing creating a new user.' + err);
                    expect(err).is.defined
                });
        });
 
        it('TEST: Removing a user', (done) => {
            let check_date = new Date(1145544774469);
            const data= {'name': 'Elim Garak'};

            udac.getUserByData(data)
                .then((user) => {
                    
                    udac.removeUserById(user.id)
                        .then((result) => {
                            expect(result.deletedCount).to.be.eq(1);
                            done();
                    })
                    .catch((err) => {
                         console.log('Error testing creating a new user.' + err);
                    });
                })
                .catch((err) => {
                    console.log('Error getting a user ' + err);
                });
        });

        after(() => {
            const data = {'name': { $ne: 'Commander Data'}};

            udac.removeUsersByCriteria(data)
                .then((result) => {
                    console.log(result.deletedCount + " records deleted");
                })
                .catch((err) => {
                    console.log('Error testing creating a new user.' + err);
                    expect(err).is.defined
                });
        });
    });
});
