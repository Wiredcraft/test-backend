const mongoose = require('mongoose');
let Users = require('../models/users');

module.exports = {

    listusers: async () => {
        try {
            let users = await Users.find();

            return users;
        } catch(err) {
          console.log("Having a problem getting user listing: " + err);
        }
    },

    getUserById: async (userId) => {
        try {
            let user = await Users.getUserById(userId);

            return user;
        } catch(err) {
          console.log("Error getting user with id: ${userId} " + err);
        }
    },

    addNewUser: async (userData) => {
        try {
            let user = await Users.create(userData);
            return user;
        } catch(err) {
            console.log("Error adding user " + err);
        }
    },

    getUserByData: async(userData) => {
        try {
            let user = await Users.findOne(userData);
            return user;
        } catch(err) {
            console.log("Error getting user with data " + err);
        }
    },

    updateUser: async(userData, updateData) => {
        try {
            let users = await Users.getUsersByData(userData);
            if (users.length == 1){
                let options = {'new': true};  // option to return updated record
                let update_user = Users.findOneAndUpdate(userData, updateData, options);
                return update_user;
            } else {
                let message = (users.length > 1) ? "No User to update" : "Multiple users found";
                console.log(message);
                throw new Error(message);
            }
            
        } catch (err) {
            console.log("Error updating user " + err);
        }
    },

    removeUserById: async (userId) => {
        try {
            let result = await Users.removeUserById(userId);
            return result; 
        } catch(err) {
            console.log("Error removing user " + err);
        }
    }

}
