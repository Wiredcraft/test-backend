//inside create_person_test.js
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const app = require('../btapp');
const Person = require('../models/person'); //imports the Person model.


describe('Person Access', function() {
    describe('Creating documents', () => {
        it('creates a person', (done) => {
            const person = new Person({ name: 'Captain Jean Luc Picard',
                                     dob: 810216104,
                                     address: 'USS Enterprise',
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
                           'address': "Deep Space Nine"},
                           {'name': "Lieutenant Montgomery Scott", 
                           'dob': new Date(-155544774469),
                           'address': "USS Enterprise"},
                          {'name': "Commandeer William Ryker", 
                           'dob': new Date(1045544774469),
                           'address': "USS Enterprise"},
                          {'name': "Ensign Ro Laren", 
                          'dob': new Date(1345544774469),
                          'address': "USS Enterprise"},
                           {'name': "Lt. Cmdr Worf", 
                           'dob': new Date(985544774469),
                           'address': "Deep Space Nine"},
                           {'name': "Lt. Cmdr Geordi LaForge", 
                           'dob': new Date(975544774469),
                           'address': "USS Enterprise"},
                          {'_id': "5debb71eac1cb28342888aba",
                           'name': "Seven of Nine",
                           'dob': new Date(1045544774469),
                           'address': "USS Voyager",
                           'description': "Former Borg member"}]
           Person.insertMany(people)
                 .then((persons) => {
                     console.log(typeof persons);
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
            const criteria =  {"address": "Deep Space Nine"};
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
