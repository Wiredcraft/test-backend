'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helmet = require('helmet')
const morgan = require('morgan')
const passport = require('./utils/passport')
const response = require('./utils/response')
const { logs } = require('../../config/vars')
const logger = require('../../config/logger')

/**
* Express instance
* @public
*/
const app = express()

// parse body params and attach them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Support HTTP verbs incase not supported by client
app.use(methodOverride())

// Secure Express application with helmet
app.use(helmet())

// Morgan to handle logs with custom logger
app.use(morgan(logs, { stream: logger.stream }))

// initialize passport authentication layer
app.use(passport.initialize())

// route to show server is running
app.get('/', (req, res, next) => {
  return res.json(response({ 'message': 'server running ' }))
})

// export the express http layer to be used
let service = {
  adapter: require('seneca-web-adapter-express'),
  context: app,
  auth: passport,
  routes: require('./connector'),
  options: {
    parseBody: false
  }
}

module.exports = service
