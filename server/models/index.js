const mongoose = require('mongoose');
const config = require('config');

mongoose.set('debug', config.get('mongoose.debug'));
const db = mongoose.createConnection(config.mongoose.uri, {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
db.on('error', err => {
  console.log(err);
});

module.exports = db;
