const mongoose = require('mongoose')

// Define the user schema
const Schema = mongoose.Schema
const UserSchema = new Schema({
  name:        { type: String, default: '' },
  dob:         { type: String, default: '' },
  address:     { type: String, default: '' },
  description: { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now }
})

/* filter by username */
UserSchema.statics.findByUsername = function (username, callback) {
  this.findOne({username: new RegExp(username, 'i')})
}

/* filter by address */
UserSchema.statics.findByAddress = function (address, callback) {
  this.findOne({address: new RegExp(address, 'i')})
}

/* Regisrer the user model and export it */
module.exports = mongoose.model('User', UserSchema)
