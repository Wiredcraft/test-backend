const
  config = require('config'),
  { syslogDal } = require(config.mongoDalPath);

class Logger {
  constructor () {
    this.connected = false;
    this.ipAddr = '127.0.0.1';
  }

  setConnect (isconnect) {
    this.connected = isconnect;
  }

  write (level, message, options) {
    if (!message) return false;

    options = options ? options : {};

    options.level = level;
    options.message = message;
    options.ipAddr = this.ipAddr;

    if (level < 4 && this.connected) {
      syslogDal.create(options, (err, data) => {
        if (err) return console.log(`log error ${err}`);
        console.log(data)
      })
    }
  }

  debug (message, options) {
    this.write(3, message, options);
  }

  info (message, options) {
    this.write(2, message, options);
  }

  warn (message, options) {
    this.write(1, message, options);
  }

  error (message, options) {
    this.write(0, message, options);
  }
}

module.exports = new Logger();