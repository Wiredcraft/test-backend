const pino = require('pino');
const prettyPrint = (process.env.LOG_PRETTY_PRINT==='true');

module.exports = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: prettyPrint ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    }
  } : null,
  serializers: {
    err: errors.bunyanSerializer,
  }
});
