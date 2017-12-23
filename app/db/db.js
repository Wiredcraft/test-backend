'use strict'

const mongoose = require('mongoose')

module.exports = {
  connect: function(){
    mongoose.connect('mongodb://localhost:27017/wiredcraft', { useMongoClient: true })
    mongoose.Promise = global.Promise
    return mongoose
  }
}
