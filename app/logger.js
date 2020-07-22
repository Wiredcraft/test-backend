const { colorConsole } = require('tracer')
const config = require('config')

const logger = colorConsole(config.log.level)
module.exports = logger
