const mongoose = require('mongoose');
const { mongoUrl} = require('../config/mongo-config');

let connection = null;

const svc = {
  getMongoConnection: function(logger = log) {
    const _log = logger.child({ module: 'mongo-service', method: 'getMongoConnection'});
    if (connection == null) {
      this.initMongoConnection(mongoUrl, _log);
    }

    return connection;
  },

  initMongoConnection: function(uri, logger = log) {
    const _log = logger.child({ module: 'mongo-service', method: 'initMongoConnection'});
    connection = mongoose.createConnection(uri);
    connection.on('error', error => {
      _log.error(`connection error: ${error}`);
    });
  }

};

module.exports = svc;

