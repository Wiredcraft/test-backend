const mongoose = require('mongoose')

// Define the user schema
const Schema = mongoose.Schema
const UserSchema = new Schema({
  name:        { type: String, default: '', trim: true, required: true },
  dob:         { type: String, default: '', required: true },
  address:     { type: String, default: '', required: true },
  description: { type: String, default: '', required: true },
  createdAt:   { type: Date, default: Date.now }
})

/* Regisrer the user model and export it */
module.exports = mongoose.model('User', UserSchema)
