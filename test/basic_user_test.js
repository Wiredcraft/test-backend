//inside create_person_test.js
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const db  = require('../config/dbservice');
const Person = require('../models/person'); //imports the Person model.


describe('Person Access', function() {
    beforeEach(() => {
        db.connect()
    });


    describe('Creating documents', () => {
        it('creates a person', (done) => {
            const person = new Person({ name: 'Captain Jean Luc Picard',
                                     dob: 810216104,
                                     address: 'USS Enterprise',
                                     position: {coordinates: [121.5874, 31.3481]},
                                     description: 'Captain of the Enterprise and foil of Q' });
            person.save()
                .then((person) => {
                    expect(person.isNew).to.be.false;  //if person is saved to db it is not new
                    done();
                });
        });

        it('Prevent a duplicate person', (done) => {
            const person = new Person({ name: 'Commander Data',
                                     dob: 810216104,
                                     address: 'USS Enterprise',
                                     position: {coordinates: [121.5874, 31.3481]},
                                     description: 'First Android in Starfleet' });
            person.save()
                .then( () => {
                    done(new Error(('Expected method to reject')));
                })
                .catch((err) => {
                    assert.isDefined(err);
                    done();
                })
                .catch(done);
        });

        it('Enter a group of persons', (done) => {
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
           Person.insertMany(people)
                 .then((persons) => {
                     expect(persons).to.be.a('array').to.have.length(7);;
                     const attrs = persons.filter(e => e.address === 'USS Enterprise');
                     expect(attrs).to.have.lengthOf.at.least(1);
                     done();
                 })
                 .catch((err) => {
                    console.log('Error while entering multiple persons ' + err);
                 })
                 .catch(done);
        });

        it('Retrieve a group of persons', (done) => {
            let criteria =  {"address": "Deep Space Nine"};
            Person.find(criteria)
                 .then((persons) => {
                     expect(persons).to.be.a('array').to.have.length(2);
                     done();
                 })
                 .catch((err) => {
                    console.log('Received an error on deletion ' + err);
                 })
                 .catch(done);
           });

        it('Retrieve a group of persons in a range ', (done) => {
            let pos =  {type: 'Point',  coordinates: [121.2772, 31.1858]};
            let distance =  5000;

            Person.findPersonInRange(pos, distance)
                 .then((persons) => {
                     expect(persons).to.be.a('array');
                     done();
                 })
                 .catch((err) => {
                    console.log('Received an error on deletion ' + err);
                 })
                 .catch(done);
           });


        it('Remove a person', (done) => {
            const name =  'Commander Data';
            Person.estimatedDocumentCount()
                 .then((numPerson) => {


                Person.deleteMany({ name: { $ne: name} })
                     .then((result) => {
               
                        let remaining = numPerson - result.deletedCount;
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
