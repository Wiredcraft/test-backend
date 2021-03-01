'use strict'

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: Date,
  address: String,
  description: String,
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
