const mongoose = require('mongoose');
const security = require('../helpers/security');
const config = require('../config');

const Schema = mongoose.Schema; // eslint-disable-line prefer-destructuring

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       name:
 *         type: string
 *       dob:
 *         type: string
 *         format: date-time
 *       address:
 *         type: string
 *       description:
 *         type: string
 *       createdAt:
 *         type: string
 *         format: date-time
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 */
const UserSchema = new Schema({
  name: {
    type: String,
  },
  dob: {
    type: Date,
  },
  address: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.methods = {
  authenticate(password) {
    return security.sha512(password, config.pwdSecret) === this.password;
  },
};

UserSchema.pre('save', function (next) { // eslint-disable-line
  if (!this.isModified('password')) return next();

  this.password = security.sha512(this.password, config.pwdSecret);
  next();
});

UserSchema.options.toJSON = {
  transform: (doc, ret) => {
    ret.id = ret._id; // eslint-disable-line no-param-reassign
    delete ret._id; // eslint-disable-line no-param-reassign
    delete ret.password; // eslint-disable-line no-param-reassign
    delete ret.__v; // eslint-disable-line no-param-reassign
    return ret;
  }
};

module.exports = mongoose.model('User', UserSchema);
