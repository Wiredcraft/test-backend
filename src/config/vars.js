'use strict'

const path = require('path')

/**
 * Import .env variables safely
 */
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example')
})

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  crypt: {
    SALT_WORK_FACTOR: 10
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES
  },
  mongo: {
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : process.env.MONGO_URI
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
}

module.exports = config
