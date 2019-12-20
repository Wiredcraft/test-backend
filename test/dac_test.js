//inside create_user_test.js
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const db  = require('../config/dbservice');
const udac = require('../controllers/dataAccessController'); //imports the User data access controller.

chai.use(chaiAsPromised);


  
    describe('Perform CRUD actions with users', () => {

        before(() => {
            const data = {'name': { $ne: 'Commander Data'}};

            udac.removePersonByCriteria(data)
                .then((result) => {
                    console.log("Database reset....");
                })
                .catch((err) => {
                    console.log('Error testing creating a new user.' + err);
                    expect(err).is.defined
                });
        });

        beforeEach(() => {
            db.connect()
        });

        it('TEST: Get a listing of users', (done) => {
            udac.listPerson()
                .then((user_list) => {
                    expect(user_list).to.be.an('array');
                    done();
                })
                .catch((err) => {
                    console.log('Error testing for the user list.' + err);
                });
        });

        it('TEST: Get one user by id', (done) => {
            const personId = '5df24fe5a151d95809659a2e';
            udac.getPersonById(personId)
                .then((person) => {
                    expect(person.name).to.be.eq('Commander Data');
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

            udac.getPersonByData(data)
                .then((person) => {
                    expect(person.description).to.include('Android');
                    done();
                })
                .catch((err) => {
                    console.log('Error testing getPersonByData.' + err);
                });
        });

        it('TEST: Do not get non-existant user', (done) => {
            let check_date = new Date(810216104);
            const data= {'name': 'Doctor Who',
                         'dob': check_date,
                         'address': 'USS Enterprise'};

            udac.getPersonByData(data)
                .then((person) => {
                    expect(person).to.be.null;
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
                         'address': 'Deep Space Nine',
                         'position' : { "type" : "Point",
                                        "coordinates" : [ 121.4499, 31.2345 ] }
                        };

            udac.addNewPerson(data)
                .then((person) => {
                    expect(person.isNew).to.be.false;
                    expect(person.name).to.be.eq('Elim Garak');
                    expect(person.address).to.be.eq('Deep Space Nine');
                    done()
                })
                .catch((err) => {
                    console.log('Error testing creating a new user.' + err);
                });
        });

        it('TEST: Do not Add a duplicate', async () => {
            let check_date = new Date(945544774469);
            const data= {'name': 'Elim Garak',
                         'dob': check_date,
                         'address': 'Deep Space Nine',
                         'position' : { "type" : "Point",
                                        "coordinates" : [ 121.4499, 31.2345 ] }
                        };

            await expect(udac.addNewPerson(data)).to.be.rejected;
        });

        it('TEST: Do not Add an incomplete user', async () => {
            let check_date = new Date(1145544774469);
            const data= {'name': 'Wesley Crusher',
                         'dob': check_date};

            await expect(udac.addNewPerson(data)).to.be.rejectedWith('address: Path `address` is required');
        });

        it('TEST: create multiple users',(done) => {
            let people = [{'name': "Captain Benjamin Sisko",
                           'dob': new Date(1135544774469),
                           'address': "Deep Space Nine",
                           'position': {coordinates: [121.4574, 31.2429]}},
                           {'name': "Lieutenant Montgomery Scott", 
                           'dob': new Date(-155544774469),
                           'address': "USS Enterprise",
                           'position': {coordinates: [121.6250, 30.9110]}},
                          {'name': "Commandeer William Ryker", 
                           'dob': new Date(1045544774469),
                           'address': "USS Enterprise",
                           'position': {coordinates: [121.4691,31.224361]}},
                          {'name': "Ensign Ro Laren", 
                          'dob': new Date(1345544774469),
                          'address': "USS Enterprise",
                           'position': {coordinates: [121.2772, 31.1857]}},
                           {'name': "Lt. Cmdr Worf", 
                           'dob': new Date(985544774469),
                           'address': "Deep Space Nine",
                           'position': {coordinates: [121.4343, 31.1983]}},
                           {'name': "Lt. Cmdr Geordi LaForge", 
                           'dob': new Date(975544774469),
                           'address': "USS Enterprise",
                           'position': {coordinates: [121.2772, 31.1858]}},
                          {'_id': "5debb71eac1cb28342888aba",
                           'name': "Seven of Nine",
                           'dob': new Date(1045544774469),
                           'address': "USS Voyager",
                           'position': {coordinates: [121.5874, 31.3481]},
                           'description': "Former Borg member"}]

            udac.addNewPerson(people)
                .then((people) => {
                    expect(people).to.be.an('array').to.have.lengthOf(7);
                    done();
                })
                .catch((err) => {
                    console.log('Error testing adding multiple users.' + err);
                });
        });

        it('TEST: Updating a user', (done) => {
            let check_date = new Date(1145544774469);
            const data = {'_id': '5debb71eac1cb28342888aba'};

            const new_data = {'address': 'Terra Prime'};

            udac.updatePersonById(data, new_data)
                .then((person) => {
                    expect(person.address).to.be.eq('Terra Prime');
                    done();
                })
                .catch((err) => {
                    console.log('Error testing updating a new user.' + err);
                });
        });

        it('TEST: Not updating when multiple users found', async () => {
            const data = {'_id': { $in: ["5debb71eac1cb28342888aba", "5df24fe5a151d95809659a2e"]}};

            const new_data = {'address': 'Bajor'};

            await expect(udac.updatePersonById(data, new_data)).to.be.rejectedWith('Error: One and only one person can be updated at a time');
        });
 
        it('TEST: Not updating when no id is present users found', async () => {
            const data = {'address': 'Deep Space Nine'};

            const new_data = {'address': 'Bajor'};

            await expect(udac.updatePersonById(data, new_data)).to.be.rejectedWith('Error: One and only one person can be updated at a time');
        });

        it('TEST: Retrieve multiple persons', (done) => {
            const data= {
                         'address': 'Deep Space Nine'
                        };

            udac.getPeopleByData(data)
                .then((persons) => {
                    expect(persons).to.be.an('array').to.have.lengthOf(3)
                    const attrs = persons.filter(e => e.address === 'Deep Space Nine');
                    expect(attrs).to.have.lengthOf.at.least(3);
                    done();
                })
                .catch((err) => {
                    console.log('Error testing creating a new user.' + err);
                });
        });

        it('TEST: Retrieve persons in a range', (done) => {
            let pos =  {type: 'Point',  coordinates: [121.2772, 31.1858]};
            let distance =  5000;

            udac.findPersonInRange(pos, distance)
                .then((persons) => {
                    expect(persons).to.be.an('array');
                    done();
                })
                .catch((err) => {
                    console.log('Error testing getting a new user in a range.' + err);
                });
        });

        it('TEST: Retrieve persons in a range of another person', (done) => {
            let personId = "5debb71eac1cb28342888aba";
            let distance =  5000;

            let persons = udac.findPersonInRangeOfId(personId, distance);
            persons.then((people) => {
                expect(people).to.be.an('array');
                const att = people.filter(e => e._id === '5debb71eac1cb28342888aba');
                expect(att).to.have.lengthOf(0);
                done();
            })
            .catch((err) => {
                    console.log('Error testing getting a new user in a range.' + err);
            });
        });
 
        it('TEST: Removing a user', (done) => {
            let check_date = new Date(1145544774469);
            const data= {'name': 'Elim Garak'};

            udac.getPersonByData(data)
                .then((person) => {
                    
                    udac.removePersonById(person.id)
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
/*
        after(() => {
            const data = {'name': { $ne: 'Commander Data'}};

            udac.removePersonByCriteria(data)
                .then((result) => {
                    console.log(result.deletedCount + " records deleted");
                })
                .catch((err) => {
                    console.log('Error deleting people.' + err);
                    expect(err).is.defined
                });
        });
    });
*/
});
