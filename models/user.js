const mongoose = require('mongoose');

const Schema = mongoose.Schema; // eslint-disable-line prefer-destructuring

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
  }
});


UserSchema.options.toJSON = {
  transform: (doc, ret) => {
    ret.id = ret._id; // eslint-disable-line no-param-reassign
    delete ret._id; // eslint-disable-line no-param-reassign
    delete ret.__v; // eslint-disable-line no-param-reassign
    return ret;
  }
};

module.exports = mongoose.model('User', UserSchema);
