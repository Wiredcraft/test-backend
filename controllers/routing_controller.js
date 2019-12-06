let mongoose = require('mongoose');
let dataAccess = require('./data_access_controller');

module.exports = { 
    getUsersList: async function(req, res, next) {
        try {
            let users = await dataAccess.listUsers()
        
            if (users) {
                return res.json(users);
            }

            return res.status(404).json({
                message: "User list not found"
            });
        } catch(err) {
           return res.status(500).json({
               message: "Error retrieving user list!" + err
           });
        }
    },

    retrieveUser: async function(req, res, next) {
        try{
            let user = await dataAccess.getUserById(req.params.userId);

            if(user) {
                return res.json(user);
            }
            return res.status(404).json({
                message: "User specified not found"
            });
        } catch(err) {
           return res.status(500).json({
               message: "Error retrieving specified user!" + err
           });
        }
    }
}
