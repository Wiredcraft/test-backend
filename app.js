'use strict'

const express = require('express')
const app = express()
const bodyParser  = require('body-parser')
const morgan  = require('morgan')
const mongoose  = require('mongoose')
const fs  = require('fs')
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT || 3000
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))

// Databse connection
require('./app/db/db').connect(config.database.connectionString)

// parse application/json
app.use(bodyParser.json())

// logging
app.use(morgan('dev'))

// start server
app.listen(PORT, function() {
  console.log(`server listening on port ${PORT}`)
})
