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
