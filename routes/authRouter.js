    /**
    * File conatains routes for registration and logging in
    *
    * @param router: Routes and endpoint functions
    *
    * @param appInstance - the app instance
    *
    * @param authRouteMethods - the registration method
    *
    * @return {route}
    *
    */
    moduule.exports = (router, appInstance, authRouteMethods) => {

        /* Route to Register a new Drone */ 
        router.post('/registerDrone', authRoutesMethods.registerUser);

        /* Route to let registered users to login with username and password */
        router.post('/login', appInstance.oauth.grant());

        return router;
    }
