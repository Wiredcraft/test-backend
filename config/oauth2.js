/**
 * This file is responsible for the issuence and renewals of the tokens.
 *
 * One token exchange strategy is for username-password flow, another is to refresh tokens
 *
 **/

const oauth2orize              = require('oauth2orize');
const passport                 = require('passport');
const crypto                   = require('crypto');
const config                   = require('./config');
const User                    = require('../models/user');
const Client                   = require('../models/client');
const {AccessToken, RefreshToken}  = require('../models/token');


// Create OAuth 2.0 server
const server = oauth2orize.createServer();

// Exchange username and password for an access token
server.exchange(oauth2orize.exchange.password( (client, username, password, scope, done) => {

    User.findOne({username: username})
        .then((user) => {
            if (!user || !user.validatePassword(password)) {
                return done(null, false);
            }
            RefreshToken.remove({ userId: user.userId, clientId: clientId })
                        .catch((err) => {
                            return done(err);
                        });
            AccessToken.remove({ userId: user.userId, clientId: client.clientId })
                       .catch((err)=> {
                           return done(err);
                       });

            let tokenValue = crypto.randomBytes(32).toString('hex');
            let refreshTokenValue = crypto.randomBytes(32).toString('hex');

            let token = new AccessToken({token: tokenValue, clientId: client.clientId, userId: user.userId });
            let refreshtoken = new RefreshToken({token: refreshTokenValue, clientId: client.clientId, userId: user.userId });

            refreshToken.save()
                        .catch((err) => {
                            return done(err);
                        });

            let info = { scope: '*' };
            token.save()
                 .then((token) => {
                     done(null, tokenValue, refreshTokenValue, {'expires_in': config.security.tokenLife});
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


// Exchange refreshToken for an access token
server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {

    RefreshToken.findOne({token: refreshToken })
                .then((token) => {
                    if (!token) {return done(mull, false); }

                    User.findById(token.userId)
                        .then((user) => {

                            if (!user) { return done(null, false);}

                            RefreshToken.remove({ userId: user.userId, clientId: clientId })
                                        .catch((err) => {
                                            return done(err);
                                        });
                            AccessToken.remove({ userId: user.userId, clientId: client.clientId })
                                        .catch((err)=> {
                                            return done(err);
                                        });

                            let tokenValue = crypto.randomBytes(32).toString('hex');
                            let refreshTokenValue = crypto.randomBytes(32).toString('hex');

                            let token = new AccessToken({token: tokenValue, clientId: client.clientId, userId: user.userId });
                            let refreshtoken = new RefreshToken({token: refreshTokenValue, clientId: client.clientId, userId: user.userId });

                            refreshToken.save()
                                        .catch((err) => {
                                            return done(err);
                                        });

                            let info = { scope: '*' };
                            token.save()
                                .then((token) => {
                                    done(null, tokenValue, refreshTokenValue, {'expires_in': config.security.tokenLife});
                                })
                                .catch((err) => {
                                    return done(err);
                                });

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


exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
    server.token(),
    server.errorHandler()
]
