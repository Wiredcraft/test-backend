let mongoose = require('mongoose');
let dataAccess = require('./data_access_controller');
let responseController = require('./response_controller');
const regex = /^\/api\//;

module.exports = { 
    getUsersList: async (req, res, next) =>  {
        try {
            let users = await dataAccess.listUsers()
            
            if (regex.exec(req.originalUrl) !== null) {
                responseController.respondToApiRequest(users, res, next);
            } else {
                let data = {'users': users}
                responseController.respondToWebRequest(data, 'userlist', res, next);
            }
        } catch(err) {
           return res.status(500).json({
               message: "Error retrieving user list!" + err
           });
        }
    },

    retrieveUser: async (req, res, next) => {
        try{
            let user = await dataAccess.getUserById(req.params.userId);

            if (regex.exec(req.originalUrl) !== null) {
                responseController.respondToApiRequest(user, res, next);
            } else {
                if (user) {
                    let data = {'user': user}
                    responseController.respondToWebRequest(data, 'user_detail', res, next);
                } else {
                    let route = '/list';
                    responseController.responseWithRedirect(route, res, next);
                }
            }
        } catch(err) {
               return res.status(500).json({
               message: "Error retrieving specified user!" + err
           });
        }
    },

    enrollUser: async (req, res, next) => {
        try {
            let user = await dataAccess.addNewUser(req.body);
        
            if (regex.exec(req.originalUrl) !== null) {
                responseController.respondToApiRequest(user, res, next);
            } else {
                if (user) {
                    let data = {'user': user}
                    responseController.respondToWebRequest(data, 'user_detail', res, next);
                } else {

                    let route = '/list';
                    responseController.responseWithRedirect(route, res, next);
                }
            }
        } catch(err) {
           return res.status(500).json({
               message: "Error enrolling new user!" + err
           });
        }
    },

    updateUser: async (req, res, next) => {
        try {
            let user = await dataAccess.updateUser(req.body.criteria,
                                                   req.body.update);
        
            if (regex.exec(req.originalUrl) !== null) {
                responseController.respondToApiRequest(user, res, next);
            } else {
                if (user) {
                    let data = {'user': user}
                    responseController.respondToWebRequest(data, 'user_detail', res, next);
                } else {

                    let route = '/list';
                    responseController.responseWithRedirect(route, res, next);
                }
            }
        } catch(err) {
            let status = err.message.indexOf("Multiple") > -1 ? 403 : 404;
            let data = {'message':  err.message}
            responseController.responsdWithApiError(data, status, res, next);
        }
    },


    deleteUser: async (req, res, next) => {
        try {
            let result = await dataAccess.removeUserById(req.body.id);
            let message = result.deletedCount + " user with id " + req.body.id + " deleted."
        
            if (regex.exec(req.originalUrl) !== null) {
                responseController.respondToApiRequest(message, res, next);
            } else {
                if (result) {
                    let data = {'message': message}
                    responseController.respondToWebRequest(data, 'user_confirmation', res, next);
                } else {

                    let route = '/list';
                    responseController.responseWithRedirect(route, res, next);
                }
            }
        } catch(err) {
           return res.status(500).json({
               message: "Error enrolling new user!" + err
           });
        }
    }
}
