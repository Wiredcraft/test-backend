/**
 * In this file the passport.js strategies are described. 
 * We connect 3 strategies – 2 for verifying Client credentials in OAuth2
 * username-password flow and one to check the token.
 *
 * BasicStrategy and ClientPasswordStrategy are responsible for Client credentials verification.
 *
 *
 *
 **/
const config                        = require('./config');
const passport                      = require('passport');
const BasicStrategy                 = require('passport-http').BasicStrategy;
const LocalStrategy                 = require('passport-local').Strategy;
const ClientPasswordStrategy        = require('passport-oauth2-client-password');
const BearerStrategy                = require('passport-http-bearer');
const User                         = require('../models/user');
const Client                        = require('../models/client');
const {AccessToken, RefreshToken}   = require('../models/token');




/***
* Passport session setup
* 
**/
    
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session
// used to serialize the user for the session

// used to deserialize the user

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({
        _id: id
    }, '-password -salt', function(err, user) {
        done(err, user);
    });
});

/**
* LOCAL SIGNUP
*
* we are using named strategies since we have one for login and one for signup
* by default, if there was no name, it would just be called 'local'
**/
passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
}, (req, username, password, done) => {

    console.log("Surrender Dorothy!!!!");
    process.nextTick(() => {

        console.log("Back to the future");
        User.findOne({ 'local.username' :  username })
             .then((user) => {
                 if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                 } else {

                    var newUser            = new User();
                    // set the user's local credentials
                    newUser.local.username    = username;
                    newUser.local.password = newUser.encryptPassword(password);
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        
                        return done(null, newUser);
                    });
                 }
             })
             .catch((err) => {
                return done(err);
             });
        
        });
    }
));    

passport.use(new BasicStrategy (
    (usermane, password, done) => {
        Client.findOne({clientId: username})
            .then((client) => {
                if (!client || client.clientSecret != password) {
                    return done(null, false);
                }
                return done(null, client);
            })
            .catch((err) => {
                return done(err);
            });
    }
));

/**
* LOCAL LOGIN 
*
**/
passport.use('local-login', new LocalStrategy ({
     usernameField : 'username',
     passwordField : 'password',
     passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (username, password, done) => {
        User.findOne({username: username})
             .then((user) => {
                if(!user || !user.validate(password)) {
                    return done(null, false);
                }
                
                 return done(null, user);
             })
             .catch((err) => {
                 return  done(err);
             });
    }
));

passport.use(new ClientPasswordStrategy (
    (clientId, clientSecret, done) => {
        Client.findOne({clientId: clientId})
            .then((client) => {
                if (!client || client.clientSecret != password) {
                    return done(null, false);
                }
                return done(null, client);
            })
            .catch((err) => {
                return done(err);
            });
    }
));

passport.use(new BearerStrategy(
    (accessToken, done) => {
        AccessToken.findOne({token: accessToken })
            .then((token) => {
                if (!token) {
                    return done(null, false);
                }

                if ( Math.round(Date.now() - token.created)/1000 > config.security.tokenLife ) {
                    AccessToken.remove({token: accessToken})
                            .catch((err) => {
                                return done(err);
                            });
                    return done(null, false, {message: "Token expired"});
                }

                User.findById(token.userId)
                    .then((user) => {
                        if (!user) {
                            return done(null, false, {message: "Unkown user"});
                        }

                        let info = {scope: '*' };
                        done(null, user, info);
                    })
                    .catch((err) => {
                        return done(err);
                    });
            })
            .catch((err) => {
                return done(err);
            });
    }
));
