/**
 * This middleware function handle some security concerns.
 * 
 * Basically shunted over checks to see that a user is either 
 * 
 * logged in or hase a verified token.
 **/

const passport              = require('passport');

/**
 * This middleware function checks that a user is logged in.
 * 
 **/
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login');
    }
}

/**
 * This middleware function checks that a user has a verified token.
 * 
 **/
const bearerVerified = (req, res, next) =>  {
    passport.authenticate('bearer', {
        session: false
    })(req, res, next);
};

module.exports = {
    isLoggedIn,
    bearerVerified
}
