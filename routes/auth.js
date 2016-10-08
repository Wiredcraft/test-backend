var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var Promise = require("bluebird");
var _ = require('lodash');
var jwt = require('jsonwebtoken');

module.exports = function(db, config) {

  router.get('/token/:id', function (req, res, next) {

    db
      .use('user')
      .get(req.params.id)
      .then(function(data) {
        // we will sign a jwt for the user whose id is provided, no password required, but it would be easy to add
        var token = jwt.sign({
          permission: {
            user: req.params.scope === undefined ? ['GET', 'PUT', 'POST', 'DELETE'] : req.params.scope.split(',')
          }
        }, new Buffer(config.token_secret, 'base64'), {
          audience: 'user:'+req.params.id,
          expiresIn: '1 day',
          issuer: 'wiredcraft-test'
        });

        return token;
      })
      .then(function(token) {
        res.send({token: token});
      })
      .catch({error: 'not_found'}, function() {
        res.status(401).send({error: 'User is not authorized to login or could not be found'});
      });
  });

  return router;
};
