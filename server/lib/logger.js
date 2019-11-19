const winston = require('winston');
const config = require('config');
const os = require('os');
const path = require('path');

const { combine, timestamp, label, prettyPrint } = winston.format;
const file = new winston.transports.File({
  filename: path.join(config.logger.path, 'server.log')
});
const transports = [];
transports.push(file);
// transports.push(new winston.transports.Console());
const logger = winston.createLogger({
  transports,
  format: combine(
    label({ label: 'demo' }),
    timestamp(),
    prettyPrint()
  )
});
const log = logger.log;
logger.log = (level, message, extra = {}) => {
  extra.hostname = os.hostname();
  log.call(logger, level, message, extra);
};

module.exports = logger;
