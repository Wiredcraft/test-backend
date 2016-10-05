'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');

var app = module.exports = loopback();
var environment = process.env.NODE_ENV;

// LOGGING
var logger = require('bunyan').createLogger({
  name: "wiredcraft-test", streams: [{
    level: environment === 'production' ? 'error' : 'info',
    path: path.join(__dirname, '..', 'logs', environment + '.log')
  }]
});
app.use(function(req, res, next) {
  req.logger = logger;
  next();
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    app.emit('started');
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
