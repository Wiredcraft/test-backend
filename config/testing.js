var path = require('path');

module.exports = {
  "database": {
    "couchdb": {
      "dsn": "http://localhost:5984"
    }
  },
  "logger": {
    level: 'error',
    streams: [{
      level: 'error',
      path: path.join(__dirname, '..', 'logs', 'testing.log')
    }]
  }
};