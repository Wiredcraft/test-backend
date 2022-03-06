'use strict';

const Logger = require('egg-logger').Logger;
const CustomTransport = require('./customTransport');

module.exports = function (ctx) {
  const logger = new Logger();
  logger.set('file', new CustomTransport({
    level: 'INFO',
    file: 'app.log'
  }, ctx));
  return logger;
};
