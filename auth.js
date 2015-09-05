'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dao = require('./lib/dao.js');

exports.init = function() {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      dao.login(username, password, function(err, isSuccess, tk) {
        if (err) {
          return done(err);
        }
        if (!isSuccess) {
          return done(null, false, { message: 'username or password are not matched.' });
        }
        return done(null, { id: username });
      });
    }
  ));

  //these two for persistent login session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    done(null, {'id': id});
  });
};
