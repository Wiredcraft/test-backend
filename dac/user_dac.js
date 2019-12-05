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
    }

}
