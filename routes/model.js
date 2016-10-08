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
        'language': 'javascript',
        '_rev': body._rev
      }, design);

      return db.insert(doc);
    });
};

module.exports = function(nano, model, defaults, design) {

  var db = nano.db.use(model);

  // setup database, validation rules
  setup(nano, db, model, design);

  // ROUTER
  // insert new record
  router.post('/', function (req, res, next) {
    var body = _.defaults(req.body, defaults);
    db
      .insert(body, uuid.v4())
      .then(function(body) {
        return db.get(body.id);
      })
      .then(function(data) {
        return res.send(_.omit(data, ['_rev']));
      })
      .catch(next);
  });

  // upsert a record
  router.put('/:id', function (req, res, next) {
    db
      .get(req.params.id)
      .then(function(data) {
        data = _.merge(data, req.body);
        return db
          .insert(data, req.params.id)
          .return(data);
      })
      .then(function (data) {
        return res.send(_.omit(data, ['_rev']));
      })
      .catch(next);
  });

  // get one record
  router.get('/:id', function (req, res) {
    db.get(req.params.id).then(function(body) {
      return res.send(_.omit(body, ['_rev']));
    });
  });

  // delete last revision
  router.delete('/:id', function (req, res) {
    db
      .get(req.params.id)
      .then(function(data) {
        return db
          .destroy(data._id, data._rev)
          .return(data);
      })
      .then(function (data) {
        return res.send(_.omit(data, ['_rev']));
      });
  });

  return router;
};
