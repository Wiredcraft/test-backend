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
const log                           = require('../libs/log')(module);
const config                        = require('./config');
const BasicStrategy                 = require('passport-http').BasicStrategy;
const LocalStrategy                 = require('passport-local').Strategy;
const ClientPasswordStrategy        = require('passport-oauth2-client-password');
const BearerStrategy                = require('passport-http-bearer');
const User                          = require('../models/user');
const Client                        = require('../models/client');
const {AccessToken, RefreshToken}   = require('../models/token');




/***
* Passport session setup
* 
**/
module.exports = (passport) => {    
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session
// used to serialize the user for the session

// used to deserialize the user

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });


/**
* LOCAL LOGIN 
*
* @param object defining option overrides 
* @param function defining the functionality of this strategy
*
**/
    passport.use(
        new LocalStrategy (
            (username, password, done) => {
                User.findOne({username: username})
                     .then((user) => {
                        if(!user || !user.validate(password)) {
                            return done(null, false);
                      }    
                         return done(null, {
                             username: user.username,
                             password: user.password
                         });
                    })
                     .catch((err) => {
                         return  done(err);
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
}
