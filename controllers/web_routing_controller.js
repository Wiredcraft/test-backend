let mongoose = require('mongoose');
let dataAccess = require('./data_access_controller');
let responseController = require('./response_controller');

module.exports = { 
    getUsersList: async (req, res, next) =>  {
        try {
            let users = await dataAccess.listUsers()

            let data = {'users': users,
                        'target': req.session.target,
                        'message': req.session.message};

            responseController.respondToWebRequest(data, 'wired_users', res, next);
        } catch(err) {
           return res.status(500).json({
               message: "Error retrieving user list!" + err
           });
        }
    },

    retrieveUser: async (req, res, next) => {
        try{
            let user = await dataAccess.getUserById(req.params.userId);

            if (user) {
                req.session.target = user.id
            } else {
                req.session.message = "Sorry, that user could not be located."
            }
            return res.redirect('/user/list');
        } catch(err) {
               return res.status(500).json({
               message: "Error retrieving specified user!" + err
           });
        }
    },

    enrollUser: async (req, res, next) => {
        try {
            // Handle the possibility of [Object: null prototype] error
            let param = JSON.parse(JSON.stringify(req.body));
            delete param._id;

            let user = await dataAccess.addNewUser(param);
        
            if (user) {
                req.session.message = user.name + " has been enrolled as a new user.";
                req.session.target = user.id
            } else {
                req.session.message = "Unable to enroll as a new user.";
            }
            return res.redirect('/user/list');
        } catch(err) {
           return res.status(500).json({
               message: "Error enrolling new user!" + err
           });
        }
    },

    updateUser: async (req, res, next) => {
        try {
            // Handle the possibility of [Object: null prototype] error
            let param = JSON.parse(JSON.stringify(req.body));
            let criteria = {"_id": param._id};
            delete param._id;
            let user = await dataAccess.updateUserById(criteria, param);
        
            if (user) {
                req.session.message = user.name + " had just been updated.";
                req.session.target = user.id
            } else {
                let message = user.name + " could not be updated.";
            }
            return res.redirect('/user/list');
        } catch(err) {
            let status = 403;
            let data = {'message':  err.message}
            responseController.responsdWithApiError(data, status, res, next);
        }
    },


    deleteUser: async (req, res, next) => {
        try {
            let param = JSON.parse(JSON.stringify(req.body));
            let result = await dataAccess.removeUserById(param._id);

            if (result) {
                let count = result.deletedCount;
                let message = "Deleted " + count + " user with id " + param._id;

                if (param.name) {
                    message = param.name  + " has been  deleted. Goodbye.";
                }

                req.session.message = message;
            } else {
                req.session.message = "Unable to delete user.";
            }
            return res.redirect('/user/list');
        } catch(err) {
           return res.status(500).json({
               message: "Error enrolling new user!" + err
           });
        }
    }
}
