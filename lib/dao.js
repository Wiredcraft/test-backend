'use strict';
var _ = require('lodash');
var users = [{ name: 'alice', password: 'secret'}, { name: 'bob', password: 'welcome' }];

exports.login = function(username, password, callback) {
  var matchedUser = _.find(users, function(u) {
    return u.name === username;
  });
  if (!matchedUser) {
    return callback(null, false);
  }
  callback(null, matchedUser.password === password);
};
