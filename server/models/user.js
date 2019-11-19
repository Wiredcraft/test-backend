const { Schema } = require('mongoose');
const pwd = require('pwd');
const db = require('./index');

const User = new Schema({
  name: { type: String, required: true, unique: true },
  dob: { type: Number },
  address: { type: String, default: '' },
  description: { type: String, default: '' },
  updateAt: { type: Date, default: Date.now },
  password: { type: String },
  salt: { type: String },
  location: { type: [Number], index: { type: '2dsphere', sparse: true } }
}, { timestamps: { createdAt: 'created_at' } });

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

// add new user encode password
User.statics.addUser = async function(user) {
  const password = String(user.password);
  const result = await pwd.hash(password);
  user.password = result.hash;
  user.salt = result.salt;

  return this.create(user);
};

module.exports = db.model('users', User);
