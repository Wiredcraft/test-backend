const mongoose = require('mongoose');
let Users = require('../models/users');

module.exports = {

    listusers: async function() {
        try {
            let users = await Users.find();

            return users;
        } catch(err) {
          console.log("Having a problem getting user listing: " + err);
        }
    }

}
