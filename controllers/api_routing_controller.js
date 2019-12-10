let mongoose = require('mongoose');
let dataAccess = require('./data_access_controller');
let responseController = require('./response_controller');
const regex = /^\/api\//;

module.exports = { 
    getUsersList: async (req, res, next) =>  {
        try {
            let users = await dataAccess.listUsers()
            
            responseController.respondToApiRequest(users, res, next);
        } catch(err) {
           return res.status(500).json({
               message: "Error retrieving user list!" + err
           });
        }
    },

    retrieveUser: async (req, res, next) => {
        try{
            let searchId = req.params.userId;
            let user = await dataAccess.getUserById(req.params.userId);

            responseController.respondToApiRequest(user, res, next);
        } catch(err) {
               return res.status(500).json({
               message: "Error retrieving specified user!" + err
           });
        }
    },

    enrollUser: async (req, res, next) => {
        try {
            let user = await dataAccess.addNewUser(req.body);
        
            responseController.respondToApiRequest(user, res, next);
        } catch(err) {
           return res.status(500).json({
               message: "Error enrolling new user!" + err
           });
        }
    },

    updateUser: async (req, res, next) => {
        try {
            let user = await dataAccess.updateUserById(req.body.criteria,
                                                   req.body.update);
            responseController.respondToApiRequest(user, res, next);
        } catch(err) {
            let status = 403;
            let data = {'message':  err.message}
            responseController.responsdWithApiError(data, status, res, next);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            let result = await dataAccess.removeUserById(req.body._id);
            let message = result.deletedCount + " user with the id " + req.body._id + " has been deleted. Goodbye.";

            if (typeof req.body.name !== "undefined") {
                message = req.body.name  + " has been deleted. Goodbye.";
            }

            responseController.respondToApiRequest(message, res, next);
        } catch(err) {
           return res.status(500).json({
               message: "Error deleting new user!" + err
           });
        }
    }
}
