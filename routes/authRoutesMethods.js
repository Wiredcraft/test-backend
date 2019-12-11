/* Controller to handle db interactions related to drones
let droneController

/**
 *  Export a function that can register drones with a 
 *  droneController with is injected into this module.
 *  
 *  @param droneController - handles drone related DB operations
 *
 *  @return {{registerDrone: registerDrone, login: *}}
 *
 **/
module.exports = injectDroneController => {
    droneController = injectDroneController

    return {
        registerDrone: registerDrone,
    }
 }


/**
 *  Handles a request to register a drone. Exepct the request body
 *  to contain a username pasword combination.  
 *  
 *  @param req - request from client
 *  @param res - response to client
 *
 **/
function registerDrone(req, res) {

    const dronename = req.body.dronename;
    const password = req.body.password;

    // Check if credentials are valid
    if (!isString(dronename) || !isString(password)){
        return sendResponse(res, "Invalid Credentials", true)
    }

    // Check if drone already exists
    droneController.doesDroneExist(dronename)
                   .then(doesDroneExist => {

                       if (doesDroneExist === false) {
                           return droneController.insertDroneToDB(dronename, password);

                       } else {

                           //Drone exist so error out
                           throw new Error('Drone already exists');
                       }})
                   .then(
                       sendResponse(res, "Huzzah! Another drone registered.", null);
                   ).catch(err => {
                       sedResponse(res, "No joy as drone failed to register", err);
                   })
}


/**
 *  Sends a response to requesting client
 *  
 *  @param res - response to client
 *  @param message - message to client
 *  @param error - error to client
 *
 **/
function sendResponse(res, message, error) {

    // Get status code based on error
    let status = error != null ? 200 : 400;

    res
       .status(status)
       .jsaon({
           'message': message,
           'error': error,
       })
}


/**
 *  Checks if a parameter is a string
 *  
 *  @param paarameter - variable to check
 *
 *  @preturn {boolean}
 *
 **/
function isString(parameter) {
    return parameter != null && (typeof parameter === "string" || parameter instanceof String) ? true : false;
}

