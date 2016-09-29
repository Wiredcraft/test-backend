var express = require('express');
var config = require('config');
var bunyan = require('bunyan');

// INIT
var app = express();
var Promise = require("bluebird");
Promise.config({cancellation: true});

var nano = require('nano-blue')(
  config.get('database.couchdb.dsn')
);

// LOGGER
var logger = bunyan.createLogger(config.get('logger'));
app.use(function(req, res, next) {
  req.logger = logger;
  next();
});

// PARSE
var bodyParser = require('body-parser')
app.use(bodyParser.json());

// ROUTES
app.use('/data/user', require('./routes/models/user.js')(nano));

// COUCHDB ERRORS
app.use(function (err, req, res, next) {
  // handle non couchdb errors to the next
  if (!err.scope || (err.scope && err.scope !== 'couch')) {
    return next(err);
  }

  req.logger.error(err);

  switch(err.error) {
    // FIXME validation function on CouchDB cannot send bad_request, so we use forbidden instead
    case 'forbidden':
      res.status(400).send({error: err.message});
      break;

    default:
      req.logger.error(err);
      res.status(500).send({error: 'Unknown database error, please contact an administrator'});
      break;
  }
});

// ERRORS
app.use(function (err, req, res, next) {
  req.logger.error(err);
  res.status(500).send({error: 'Unknown error, please contact an administrator'})
});

// START
app.start = function(port) {
  return app.listen(port, function () {
    app.emit('started');
  });
};

module.exports = app;

// start the server if `$ node server.js`
if (require.main === module) {
  app.start(3000);
  console.log('App started on port 3000');
}
