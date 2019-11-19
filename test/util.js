const config = require('config');
const jwt = require('jsonwebtoken');

/**
 * generate json web token by user giving
 * @param {Object} user
 * @return {String} token
 */
exports.getToken = user => {
  const authricated = {
    username: user.name,
    timestamp: parseInt(Date.now() / 1000),
    ttl: config.get('jwt.ttl'),
    isAdmin: user.isAdmin
  };
  const token = jwt.sign({ data: authricated }, config.get('jwt.secret'), config.get('jwt.options'));

  return token;
};
