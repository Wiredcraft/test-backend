const mongoose = require('mongoose')

// Define the user schema
const Schema = mongoose.Schema
const UserSchema = new Schema({
  username:    { type: String, default: '', required: true },
  googleId:    { type: String, default: '', required: true },
  createdAt:   { type: Date, default: Date.now }
})

/* Regisrer the user model and export it */
module.exports = mongoose.model('User', UserSchema)
