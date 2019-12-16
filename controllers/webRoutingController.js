let mongoose = require('mongoose');
let dataAccess = require('./dataAccessController');
let responseController = require('./responseController');

module.exports = { 
    goHome: (req, res, next) => {
        res.render('home');
    },

    signIn: (req, res, next) => {
        res.render('login');
    },

    enroll: (req, res, next) => {
        res.render('register');
    },

    logout: (req, res, next) => {
        req.logout();
        res.redirect('/');
    },

    getPersonList: async (req, res, next) =>  {
        try {
            let persons = await dataAccess.listPerson()

            let data = {'users': persons,
                        'target': req.session.target,
                        'message': req.session.message,
                        'errors': req.session.val_errors};

            delete req.session.target;
            delete req.session.message;
            delete req.session.val_errors;

            return res.render('wired_users', data);
        } catch(err) {
            req.session.message = "Error retrieving person list!\n" + err;
            return res.redirect('/user/list');
        }
    },

    retrievePerson: async (req, res, next) => {
        if (req.session.val_errors) {
            return res.redirect('/user/list');
        }
        try{
            let person = await dataAccess.getPersonById(req.params.personId);

            if (person) {
                req.session.target = person.id
            } else {
                req.session.message = "Sorry, that person could not be located."
            }
            return res.redirect('/user/list');
        } catch(err) {
            req.session.message = "Error retrieving specified user!\n" + err;
            return res.redirect('/user/list');
        }
    },

    retrievePeople: async (req, res, next) => {
        if (req.session.val_errors) {
            return res.redirect('/user/list');
        }
        try{
            let param = JSON.parse(JSON.stringify(req.body));
            let persons = await dataAccess.getPeopleByData(param.criteria);

            let message = persons.length + " matches found."
            let data = {'users': persons,
                        'message': message}


            return res.render('wired_users', data);
        } catch(err) {
            req.session.message = "Error retrieving specified user!\n" + err;
            return res.redirect('/user/list');
        }
    },

    retrievePeopleRangeOfId: async (req, res, next) => {
        if (req.session.val_errors) {
            return res.redirect('/user/list');
        }
        try{
            console.log(req.body);
            let param = JSON.parse(JSON.stringify(req.body));
            let persons = await dataAccess.findPersonInRangeOfId(param._id, param.distance);
             console.log(persons);
            res.setHeader('Content-Type', 'application/json');
            res.json(persons);
        } catch(err) {
            console.log('Some error');
            console.log(err);
            req.session.message = "Error retrieving people near this person!\n" + err;
            return res.redirect('/user/list');
        }
    },

    enrollPerson: async (req, res, next) => {
        if (req.session.val_errors) {
            return res.redirect('/user/list');
        }
        try {
            // Handle the possibility of [Object: null prototype] error
            let param = JSON.parse(JSON.stringify(req.body));
            delete param._id;

            let person = await dataAccess.addNewPerson(param);
        
            if (person) {
                req.session.message = person.name + " has been enrolled as a new person.";
                req.session.target = person.id
            } else {
                req.session.message = "Unable to enroll as a new person.";
            }
            return res.redirect('/user/list');
        } catch(err) {
            req.session.message = "Error enrolling new user!\n" + err;
            return res.redirect('/user/list');
        }
    },

    updatePerson: async (req, res, next) => {
        if (req.session.val_errors) {
            return res.redirect('/user/list');
        }
        try {
            // Handle the possibility of [Object: null prototype] error
            let param = JSON.parse(JSON.stringify(req.body));
            let criteria = {"_id": param._id};
            delete param._id;
            let person = await dataAccess.updatePersonById(criteria, param);
        
            if (person) {
                req.session.message = person.name + " had just been updated.";
                req.session.target = person.id
            } else {
                let message = person.name + " could not be updated.";
            }
            return res.redirect('/user/list');
        } catch(err) {
            req.session.message = "Error updating person!\n" + err;
            return res.redirect('/user/list');
        }
    },


    deletePerson: async (req, res, next) => {
        if (req.session.val_errors) {
            return res.redirect('/user/list');
        }
        try {
            let param = JSON.parse(JSON.stringify(req.body));
            let result = await dataAccess.removePersonById(param._id);

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
            req.session.message = "Error deleting person!\n" + err;
            return res.redirect('/user/list');
        }
    }
}
