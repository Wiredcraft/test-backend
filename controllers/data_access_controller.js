const mongoose = require('mongoose');
let Users = require('../models/users');

module.exports = {
    /**
     * List all the users stored in the database
     *
     **/
    listUsers: async () => {
        try {
            let users = await Users.find();

            return users;
        } catch(err) {
          console.log("Having a problem getting user listing: " + err);
        }
    },

    /**
     * Retrieve a user stored in database via an id
     *
     * param: userId - String
     *
     **/
    getUserById: async (userId) => {
        try {
            let user = await Users.getUserById(userId);

            return user;
        } catch(err) {
          console.log("Error getting user with id: ${userId} " + err);
        }
    },

    /**
     * Add user(s) into the database
     *
     * param: userData - associative array/array of associative arrays
     *
     **/
    addNewUser: async (userData) => {
        try {
            let user = await Users.create(userData);
            return user;
        } catch(err) {
            throw new Error(err);
        }
    },

    /**
     * Retrieve one user from the database based on input criteria
     *
     * param: userData - associative array/array of associative arrays
     *
     **/
    getUserByData: async(userData) => {
        try {
            let user = await Users.findOne(userData);
            return user;
        } catch(err) {
            console.log("Error getting user with data " + err);
        }
    },

    /**
     * Update one user from the database based on input criteria
     *
     * param: criteria - associative array containing userId of user 
     *        to update as a value. 
     * param: updateData - associative array: values to update
     *
     * return updated record
     **/
    updateUserById: async(criteria, updateData) => {
        try {
            let users = await Users.getUsersByData(criteria);
            if (users.length == 1){
                let options = {'new': true};  // option to return updated record
                let update_user = Users.findOneAndUpdate(criteria, updateData, options);
                return update_user;
            } else {
                let message = "One and only one user can be updated at a time";
                throw new Error(message);
            }
            
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * Remove one user from the database based on userId
     *
     * param: userId - String
     *
     **/
    removeUserById: async (userId) => {
        try {
            let result = await Users.removeUserById(userId);
            return result; 
        } catch(err) {
            console.log("Error removing user " + err);
        }
    },

    /**
     * Remove multiple users from the database based on query
     * THIS FUNCTION IS FOR TESTING PURPOSES ONLY.
     *
     * param: query - associative array
     *
     **/
    removeUsersByCriteria: async (criteria) => {
        try {
            let result = await Users.deleteMany(criteria);
            return result; 
        } catch(err) {
            console.log("Error removing user " + err);
        }
    }

}
