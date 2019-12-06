const mongoose = require('mongoose');
let Users = require('../models/users');

module.exports = {
    /**
     * List all the users stored in the database
     *
     **/
    listusers: async () => {
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
            console.log("Error adding user " + err);
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
     * param: userData - associative array: search criteria for user
     * param: updateData - associative array: values to update
     *
     * return updated record
     **/
    updateUser: async(userData, updateData) => {
        try {
            let users = await Users.getUsersByData(userData);
            if (users.length == 1){
                let options = {'new': true};  // option to return updated record
                let update_user = Users.findOneAndUpdate(userData, updateData, options);
                return update_user;
            } else {
                let message = (users.length > 1) ? "No User to update" : "Multiple users found";
                throw new Error(message);
            }
            
        } catch (err) {
            console.log("Error updating user " + err);
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
