let mongoose = require('mongoose');
let dataAccess = require('./dataAccessController');
let responseController = require('./responseController');

module.exports = { 
    getUsersList: async (req, res, next) =>  {
        try {
            let users = await dataAccess.listUsers()

            let data = {'users': users,
                        'target': req.session.target,
                        'message': req.session.message,
                        'errors': req.session.val_errors};

            delete req.session.target;
            delete req.session.message;
            delete req.session.val_errors;

            responseController.respondToWebRequest(data, 'wired_users', res, next);
        } catch(err) {
            req.session.message = "Error retrieving user list!\n" + err;
            return res.redirect('/user/list');
        }
    },

    retrieveUser: async (req, res, next) => {
        if (req.session.val_errors) {
            return res.redirect('/user/list');
        }
        try{
            let user = await dataAccess.getUserById(req.params.userId);

            if (user) {
                req.session.target = user.id
            } else {
                req.session.message = "Sorry, that user could not be located."
            }
            return res.redirect('/user/list');
        } catch(err) {
            req.session.message = "Error retrieving specified user!\n" + err;
            return res.redirect('/user/list');
        }
    },

    enrollUser: async (req, res, next) => {
        if (req.session.val_errors) {
            return res.redirect('/user/list');
        }
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
            req.session.message = "Error enrolling new user!\n" + err;
            return res.redirect('/user/list');
        }
    },

    updateUser: async (req, res, next) => {
        if (req.session.val_errors) {
            return res.redirect('/user/list');
        }
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
            req.session.message = "Error updating user!\n" + err;
            return res.redirect('/user/list');
        }
    },


    deleteUser: async (req, res, next) => {
        if (req.session.val_errors) {
            return res.redirect('/user/list');
        }
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
            req.session.message = "Error deleting user!\n" + err;
            return res.redirect('/user/list');
        }
    }
}
