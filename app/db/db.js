'use strict'

const mongoose = require('mongoose')

module.exports = {
  connect: function(connectionString){
    mongoose.connect(connectionString, { useMongoClient: true })
    mongoose.Promise = global.Promise
    return mongoose
  }
}
