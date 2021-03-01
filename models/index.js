'use strict'

const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test-backend'
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log('MongoDB connection error. Please make sure MongoDB is running.')
  process.exit(1)
})
