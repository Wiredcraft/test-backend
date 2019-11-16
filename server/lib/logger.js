import winston from 'winston';
import config from 'config';
import os from 'os';

const file = new winston.transports.File({
  filename: config.logger.path
  + new Date().toLocaleDateString().replace(/\//g, '_')
  + '.log'
});
const transports = [];
transports.push(file);
transports.push(new winston.transports.Console());
const logger = new winston.Logger({transports});
const log = logger.log;
logger.log = function (level, ...rest) {
  rest[0] = [os.hostname(), rest[0]].join('# ');
  log.call(logger, level, ...rest);
};

export default logger;
