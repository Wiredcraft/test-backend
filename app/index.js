const config = require('config')
const logger = require('./logger')
const app = require('./app')

logger.warn('NODE_ENV: ' + config.util.getEnv('NODE_ENV'))
logger.info('listen on ', config.listen)

app.listen(config.listen.port)
