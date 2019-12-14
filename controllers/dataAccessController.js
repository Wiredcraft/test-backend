const mongoose = require('mongoose');
let Person = require('../models/person');

module.exports = {
    /**
     * List all the persons stored in the database
     *
     **/
    listPerson: async () => {
        try {
            let person = await Person.find();

            return person;
        } catch(err) {
          console.log("Having a problem getting person listing: " + err);
        }
    },

    /**
     * Retrieve a person stored in database via an id
     *
     * @param: personId - String
     *
     **/
    getPersonById: async (personId) => {
        try {
            let person = await Person.getPersonById(personId);

            return person;
        } catch(err) {
          console.log("Error getting person with id: ${personId} " + err);
        }
    },

    /**
     * Add person(s) into the database
     *
     * @param: personData - associative array/array of associative arrays
     *
     **/
    addNewPerson: async (personData) => {
        try {
            let person = await Person.create(personData);
            return person;
        } catch(err) {
            throw new Error(err);
        }
    },

    /**
     * Retrieve one person from the database based on input criteria
     *
     * @param: personData - associative array/array of associative arrays
     *  In the case of an array of objects, the first mtch will be sent.  
     *
     **/
    getPersonByData: async(personData) => {
        try {
            let person = await Person.findOne(personData);
            return person;
        } catch(err) {
            console.log("Error getting person with data " + err);
        }
    },

    /**
     * Retrieve one person from the database based on input criteria
     *
     * @param: personData - associative array/array of associative arrays
     *  In the case of an array of objects, the first mtch will be sent.  
     *
     **/
    getPeopleByData: async(criteria) => {
        try {
            let persons = await Person.find(criteria);
            return persons;
        } catch(err) {
            console.log("Error getting mulitple persons with data " + err);
        }
    },

    /**
     * Update one person from the database based on input criteria
     *
     * @param: criteria - associative array containing personId of person 
     *        to update as a value. 
     * @param: updateData - associative array: values to update
     *
     * return updated record
     **/
    updatePersonById: async(criteria, updateData) => {
        try {
            let person = await Person.getPersonByData(criteria);
            if (person.length == 1){
                let options = {'new': true};  // option to return updated record
                let update_person = Person.findOneAndUpdate(criteria, updateData, options);
                return update_person;
            } else {
                let message = "One and only one person can be updated at a time";
                throw new Error(message);
            }
            
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * Find persons within a certain distance
     *
     * @param: location -location object: based on the field in the Person Model
     * @param: distance - Integer:  max distance, in meters, from the provided location
     **/
    findPersonInRange: async (position, distance) => {
        try {
            let result = await Person.findPersonInRange(position, distance);
            return result; 
        } catch(err) {
            console.log("Error finding person(s) " + err);
        }
    },

    /**
     * Remove one person from the database based on personId
     *
     * @param: personId - String
     *
     **/
    removePersonById: async (personId) => {
        try {
            let result = await Person.removePersonById(personId);
            return result; 
        } catch(err) {
            console.log("Error removing person " + err);
        }
    },

    /**
     * Remove multiple person from the database based on query
     * THIS FUNCTION IS FOR TESTING PURPOSES ONLY.
     *
     * @param: query - associative array
     *
     **/
    removePersonByCriteria: async (criteria) => {
        try {
            let result = await Person.deleteMany(criteria);
            return result; 
        } catch(err) {
            console.log("Error removing person " + err);
        }
    }

}
