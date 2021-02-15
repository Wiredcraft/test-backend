const mongoose = require('mongoose');
const config = require('config');
const logger = require('./log');

class Mongo {
  constructor() {
    this.url = config.get('mongo.url');
    this.connection = null;
  }

  async init() {
    await mongoose.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    this.connection = mongoose.connection;
    this.connection.on('error', (err) => {
      logger.error(err);
    });
    this.connection.once('connected', () => {
      logger.debug('Mongo:: connected');
    });
    this.connection.on('reconnected', () => {
      logger.debug('Mongo:: reconnected');
    });
    this.connection.on('disconnected', () => {
      logger.debug('Mongo:: disconnected');
    });
  }

  getConnection() {
    return this.connection;
  }

  shutdown() {
    this.connection.close(false, () => {
      logger.info('Mongo:: closed');
    });
  }
}

module.exports = new Mongo();

