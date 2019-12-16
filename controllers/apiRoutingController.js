let mongoose = require('mongoose');
let dataAccess = require('./dataAccessController');
let responseController = require('./responseController');
const regex = /^\/api\//;

module.exports = { 
    getPersonList: async (req, res, next) =>  {
        try {
            let person = await dataAccess.listPerson()
            
            responseController.respondToApiRequest(person, res, next);
        } catch(err) {
           return res.status(500).json({
               message: "Error retrieving person list!" + err
           });
        }
    },

    retrievePerson: async (req, res, next) => {
        try{
            let searchId = req.params.personId;
            let person = await dataAccess.getPersonById(req.params.personId);

            responseController.respondToApiRequest(person, res, next);
        } catch(err) {
               return res.status(500).json({
               message: "Error retrieving specified person!" + err
           });
        }
    },

    enrollPerson: async (req, res, next) => {
        try {
            let person = await dataAccess.addNewPerson(req.body);
        
            responseController.respondToApiRequest(person, res, next);
        } catch(err) {
           return res.status(500).json({
               message: "Error enrolling new person!" + err
           });
        }
    },

    updatePerson: async (req, res, next) => {
        try {
            let person = await dataAccess.updatePersonById(req.body.criteria,
                                                   req.body.update);
            responseController.respondToApiRequest(person, res, next);
        } catch(err) {
            let status = 403;
            let data = {'message':  err.message}
            responseController.responsdWithApiError(data, status, res, next);
        }
    },

    retrieveGroup: async (req, res, next) => {
        try {
            let group = await dataAccess.getPeopleByData(req.body.criteria);
            responseController.respondToApiRequest(group, res, next);
        } catch(err) {
            let status = 403;
            let data = {'message':  err.message}
            responseController.responsdWithApiError(data, status, res, next);
        }
    },

    retrieveInRange: async (req, res, next) => {
        try {
            let group = await dataAccess.findPersonInRange(req.body.position,
                                                            req.body.distance);
            responseController.respondToApiRequest(group, res, next);
        } catch(err) {
            let status = 403;
            let data = {'message':  err.message}
            responseController.responsdWithApiError(data, status, res, next);
        }
    },

    retrieveInRangeOfId: async (req, res, next) => {
        try {
            let group = await dataAccess.findPersonInRangeOfId(req.body._id,
                                                            req.body.distance);
            responseController.respondToApiRequest(group, res, next);
        } catch(err) {
            console.log(err.message);
            let status = 403;
            let data = {'message':  err.message}
            responseController.responsdWithApiError(data, status, res, next);
        }
    },

    deletePerson: async (req, res, next) => {
        try {
            let result = await dataAccess.removePersonById(req.body._id);
            let message = result.deletedCount + " person with the id " + req.body._id + " has been deleted. Goodbye.";

            if (typeof req.body.name !== "undefined") {
                message = req.body.name  + " has been deleted. Goodbye.";
            }

            responseController.respondToApiRequest(message, res, next);
        } catch(err) {
           return res.status(500).json({
               message: "Error deleting new person!" + err
           });
        }
    }
}
