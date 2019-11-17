const { Schema } = require('mongoose');
const conn = require('./index');

const User = new Schema({
  name: { type: String, required: true, unique: true },
  dob: { type: Date },
  address: { type: String, default: '' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  password: { type: String },
  salt: { type: String },
  location: { type: [Number], index: { type: '2dsphere', sparse: true } }
});

User.options.toObject = {};
User.options.toJSON = {};
User.options.toObject.transform = (doc, ret, options) => {
  // remove the salt and password of every document before returning the result
  delete ret.password;
  delete ret.salt;

  return ret;
};

User.options.toJSON.transform = (doc, ret, options) => {
  // remove the salt and password of every document before returning the result
  delete ret.password;
  delete ret.salt;
};

module.exports = conn.model('users', User);
