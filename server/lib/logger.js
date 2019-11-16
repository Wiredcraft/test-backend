const winston = require("winston");
const config = require("config");
const os = require("os");
const path = require("path");

const file = new winston.transports.File({
  filename: path.join(config.logger.path, "server.log")
});
const transports = [];
transports.push(file);
transports.push(new winston.transports.Console());
const logger = new winston.Logger({ transports });
const log = logger.log;
logger.log = function(level, ...rest) {
  rest[0] = [os.hostname(), rest[0]].join("# ");
  log.call(logger, level, ...rest);
};

export default logger;
