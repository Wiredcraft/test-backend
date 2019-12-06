let mongoose = require('mongoose');
let dataAccess = require('./data_access_controller');

module.exports = { 
    getUsersList: async function(req, res, next) {
        try {
            let users = await dataAccess.listUsers()
        
            if (users) {
                return res.end(JSON.stringify(users));
            }

            return res.status(404).json({
                message: "User list not found"
            });
        } catch(err) {
           return res.status(500).json({
               message: "Error retrieving user list!" + err
           });

        }
    }
}
