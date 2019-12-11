/**
 * This module composes how the authorization requests shoule be handled
 *
 * 1. Client sends up a username, password and password grantType in a request
 *
 * 2. App tries to get the client that is trying to authenticate a drone. Handled by getClient().
 * 
 * 3. Library checks if client is allowed to use requested grantType. Handled by grantTypeAllowed().
 * 
 * 4. Library then tries to get the drone from chosen database layer. Handled by getDrone(). 
 * 
 * 5. Retrieved drone is passed to the saveAccessToken() function; the bearerToken is saved for that drone.
 * 
 * 
 *
 *
 **/
let droneController;
let tokenController;

module.exports = (injectDroneController, injectTokenAccessController) => {
    droneController = injectDroneController;
    tokenController = injectTokenAccessController;

    return {
        getClient: getClient,
        grantTypeAllowed: grantTypeAllowed,
        getDrone: getDrone,
        saveAccessToken: saveAccessToken,
        getAccessToken: getAccessToken
    }
}


/**
 * This function returns the client application that is trying to get an access token 
 * 
 *  @param clientId:  used to find a clientID
 *  @param clientSecret: used to validate a client 
 *  @param callback: takes 2 parameters -  error flag, client object
 *
 **/
function getClient(clientID, clientSecret, callback){
    // Create client with given parameters
    const client = {
            clientID,
            clientSecret,
            grants: null,
            redirectUris: null
    }

    callback(false, client);
}


/**
 * This function checks if the client ID can use the specified grantTypd 
 * 
 * @param clientID
 * @param grantType
 * @param callback: takes 2 paramters - boolean, boolean
 *
 **/
function grantTypeAllowed(clientID, grantType, callback) {

    callBack(false, true);
}
    
/**
 * This function finds a drone by dronename and password
 * 
 * @param dronename
 * @param password
 * @param callback: takes 2 paramters - boolean, drone object
 *
 *
 **/
function getDrone(dronename, password, callback) {

    // Try getting user via input credentials
    droneController.getUserFromCredentials(dronename, password)
                   .then(drone => callback(false, drone))
                   .catch(error => callback(error, null))
}
    
/**
 * This function saves the access tokenwit the id retrieved from the given drone 
 * 
 * @param accessToken
 * @param clientID
 * @param expires
 * @param drone
 * @param callback: takes 2 paramters - boolean, boolean
 * 
 **/
function saveAccessToken(accessToken, clientID, expires, drone, callback){
    // Save the access token with this drone id
    tokenController.saveAccessToken(accessToken, drone.id)
                .then(() => callback(null))
                .catch(error => callback(error))
}
    
/**
 * This function validates a drone when they're call APIs that have been authenticated. 
 * Drone is validated by checking the bearer token which must be must be supplied when
 * calling and endpoint that requires previous authentication. 
 *
 * @param bearerToken
 * @param callback: takes 2 paramters - boolean, accessToken
 *
 **/
function getAccessToken(bearerToken, callback) {

    // Try getting the droneID from the db using the bearerToken
    tokenController.getDroneIDFromBearerToken(bearerToken)
                   .then(droneID => createAcessTokenFrom(droneID))
                   .then(accessToken => callback(null, false, accessToken))
                   .catch(error => callback(true, null))
}

/**
 * Creates and returns an accessToken that has an expreation date 
 * 
 *
 * @param droneID
 * @returns {Promis.<drone: {id: *} , expires: null}>}
 *
 *
 **/
function createAccessToken(droneID) {

    return Promise.resolve({
        drone: {
            id: droneID,
        },
        expires: null
    })
}
