const
  config = require('config'),
  { syslogDal } = require(config.mongoDalPath),
  os = require('os');

class Logger {
  constructor () {
    this.connected = false;
    this.ipAddr = this.getIpAddr();
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

  getIpAddr () {
    let ipv4 = '127.0.0.1';
    for (let addr of os.networkInterfaces()['Loopback Pseudo-Interface 1']) {
      if (addr.family === 'IPv4') ipv4 = addr.address;
    }
    return ipv4;
  }
}

module.exports = new Logger();
