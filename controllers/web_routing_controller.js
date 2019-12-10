let mongoose = require('mongoose');
let dataAccess = require('./data_access_controller');
let responseController = require('./response_controller');

module.exports = { 
    getUsersList: async (req, res, next) =>  {
        try {
            let users = await dataAccess.listUsers()
            
            let data = {'users': users}
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
            let users = await dataAccess.listUsers();

            if (user) {
                let data = {'user': user, 'target_id': req.params.userId}
                responseController.respondToWebRequest(data, 'user_detail', res, next);
            } else {
                return res.redirect('/user/list');
            }
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
            let user = await dataAccess.addNewUser(param);
            let users = await dataAccess.listUsers();
        
            if (user) {
                let message = user.name + " had just been enrolled as a new user.";
                let data = {'users': users, 'target_id': user.id, 'message': message  }
                responseController.respondToWebRequest(data, 'wired_users', res, next);
            } else {
                return res.responseWithRedirect('/user/list');
            }
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
            let users = await dataAccess.listUsers();
        
            if (user) {
                let message = user.name + " had just been updated.";
                let data = {'users': users, 'target_id': user.id, 'message': message  }
                responseController.respondToWebRequest(data, 'wired_users', res, next);
            } else {
                return res.redirect('/user/list');
            }
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
            let users = await dataAccess.listUsers();

            if (param.name) {
                let message = param.name  + " has been  deleted. Goodbye.";
            } else {
                let count = result.deletedCount;
                let message = "Deleted " + count + " user with id " + param._id;
            }

            if (result) {
                let data = {'users': users, 'message': message};
                responseController.respondToWebRequest(data, 'wired_users', res, next);
            } else {
                return res.redirect('/user/list');
            }
        } catch(err) {
           return res.status(500).json({
               message: "Error enrolling new user!" + err
           });
        }
    }
}
