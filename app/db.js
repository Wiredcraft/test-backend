const { mongodbUri } = require('config')
const mongoose = require('mongoose')
const logger = require('./logger')

const connection = mongoose.createConnection(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })

connection.on('connected', () => {
  logger.debug(`conneect to ${mongodbUri} success`)
})
connection.on('disconnected', () => {
  logger.debug(`connection to ${mongodbUri} has been disconnected`)
})

mongoose.set('debug', true)

module.exports = connection
