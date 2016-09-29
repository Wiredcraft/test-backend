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
  },
  "auth": {
    token_secret: 'X2l2dDVjNmUkbXN2KnYjPT8xP3JrbWVeaWk3N2V3NjJiYTk4dW5AcjUjcXM1NyFvI2gxejMzMDhh Y3N8NSt4Mg=='
  }
};