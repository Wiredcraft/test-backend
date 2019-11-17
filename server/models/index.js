const mongoose = require('mongoose');
const config = require('config');

mongoose.set('debug', config.get('mongoose.debug'));
const conn = mongoose.createConnection(config.mongoose.uri, {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = conn;
