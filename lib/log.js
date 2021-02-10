const log4js = require('log4js');
const config = require('config');

log4js.configure(config.get('log4js'));

class Log {
  constructor() {
    this.logger = log4js.getLogger('log');
  }

  error(msg) {
    this.logger.error(msg);
  }

  info(msg) {
    this.logger.info(msg);
  }

  debug(msg) {
    this.logger.debug(msg);
  }

  warn(msg) {
    this.logger.warn(msg);
  }
}

module.exports = new Log();
