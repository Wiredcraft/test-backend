var express = require('express');
var config = require('config');
var bunyan = require('bunyan');
var cors = require('cors');
var jwt = require('jsonwebtoken');

// INIT
var app = express();

var Promise = require("bluebird");
Promise.config({cancellation: true});

var nano = require('nano-blue')(
  config.get('database.couchdb.dsn')
);

app.locals.nano = nano;

// CORS
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// LOGGER
var logger = bunyan.createLogger(config.get('logger'));
app.use(function(req, res, next) {
  req.logger = logger;
  next();
});

// PARSE
var bodyParser = require('body-parser')
app.use(bodyParser.json());

// AUTHENTICATION
var authentication = function(model) {
  return function(req, res, next) {
    var authorizationheader = req.get('Authorization');
    if (authorizationheader === undefined) {
      return res.send(401, 'Missing authorization header');
    }

    var tokens = authorizationheader.split('Bearer ');
    if (tokens[1] === undefined) {
      res.status(401).send({'error': 'Authorization header should be Bearer token'})
    }
    req.token = tokens[1];

    try {
      var token = jwt.verify(req.token, new Buffer(config.get('auth.token_secret'),'base64'), {
        issuer: 'wiredcraft-test'
      });
    }
    catch(err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).send({'error': 'Token expired'})
      }

      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).send({'error': 'Json web token verification error'})
      }

      throw err;
    }

    // check if user is allowed in here
    if (token.permission[model] === undefined) {
      return res.status(401).send({'error': 'Permission error, user is not allowed for this model'});
    }

    // check if user is allowed for this request method
    if ( !token.permission[model].includes(req.method)) {
      return res.status(401).send({'error': 'Permission error, user is not allowed for this operation on this model'});
    }

    next();
  };
};

// ROUTES
app.use('/data/user', authentication('user'), require('./routes/models/user.js')(nano));
app.use('/auth', require('./routes/auth.js')(nano, config.get('auth')));

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
