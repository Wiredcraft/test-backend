var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var Promise = require("bluebird");
var _ = require('lodash');

var setup = function(nano, db, model, design) {
  // make sure model is created
  nano.db
    .create(model)
    // if db exists do nothing
    .catchReturn({error: 'file_exists'}, Promise.resolve())
    // setup nano
    .then(function () {
      if (!design) {
        return Promise.resolve().cancel();
      }
    })
    // create design document for that model if specified
    .then(function () {
      var doc = _.merge({
        '_id': '_design/' + model,
        'language': 'javascript'
      }, design);

      return db.insert(doc);
    })
    .catchReturn({error: 'conflict'}, Promise.resolve())

    // update the design if not already
    .then(function () {
      return db.get('_design/' + model)
    })
    .then(function (body) {
      // if design document is already there, update it
      var doc = _.merge({
        '_id': '_design/' + model,
        'language': 'javascript'
      }, design);

      return db.insert(doc);
    });
};

module.exports = function(nano, model, validate) {

  var db = nano.db.use(model);

  // setup database, validation rules
  setup(nano, db, model, design);

  router.post('/', function (req, res, next) {
    db
      .insert(req.body, uuid.v4())
      .then(function(body) {
        return db.get(body.id);
      })
      .then(function(body) {
        return res.send(body);
      })
      .catch(next);
  });

  router.get('/', function (req, res) {

  });

  return router;
};
