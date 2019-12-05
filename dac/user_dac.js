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
            console.log("Error getting user with data" + err);
        }
    },

    getUserByData: async(userData) => {
        try {
            let user = await Users.findOne(userData);
            return user;
        } catch(err) {
          console.log("Error getting user with data" + err);
        }
    }

}
