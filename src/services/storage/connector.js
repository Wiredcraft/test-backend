let handler = require('./handler')
const logger = require('../../config/logger')

async function init () {
  // connect to Mongo instance
  try {
    const connection = await handler.connect()
    return connection
  } catch (e) {
    logger.error('Connection to Mongo instance failed:', e)
  }
}

module.exports = init
