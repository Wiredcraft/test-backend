const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', handleExceptions: true }),
    new winston.transports.File({ filename: 'logs/combined.log', handleExceptions: true })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: 'debug',
    format: winston.format.simple(),
    colorize: true
  }))
}

logger.stream = {
  write: (message) => {
    logger.info(message.trim())
  }
}

module.exports = logger
