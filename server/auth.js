'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user = { // This a hard-coded user
  _id: 1,
  username: 'fred',
  email: 'gundam0083ster@gmail.com',
  password: 'password',
};

var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
    function(username, password, callback) {
        // This should check again db
      if (username === user.username && password === user.password) {
        return callback(null, user);
      } else {
        callback(null, false, {message: 'Invalid username and password.'});
      }
    }
));

// Required for storing user info into session
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// Required for retrieving user from session
passport.deserializeUser(function(id, done) {
    // The user should be queried against db
    // using the id
  done(null, user);
});

module.exports = passport;
