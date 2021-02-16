const mongoose = require('mongoose');
const core = require('./core');

const { Schema } = mongoose;

const userSchema = new Schema({
  id: Schema.ObjectId,
  name: String, // we consider name is unique in this demo
  dob: String,
  address: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
});

const UserModel = mongoose.model('users', userSchema);

/**
 * insert user into collection.users
 *
 * @param {object} options - options
 * @param {string} options.name - user name
 * @param {string} options.dob - user birth date
 * @param {string} options.address - user addres
 * @param {string} options.description - user description
 * @returns {object} - user info
 */
exports.insertUser = async (options) => {
  const user = new UserModel(options);
  const { _id } = await core.save(user, options);
  return {
    userId: _id.toString(),
  }
}

/**
 *
 *
 * @param {string} userId - userId
 * @returns {object|null} - result
 */
exports.findUserByUserId = async (userId) => {
  const result = await UserModel.findOne({
    _id: mongoose.Types.ObjectId(userId)
  });
  return result;
}

/**
 *
 *
 * @param {string} userId - userId
 * @returns {number} - deleted rows count
 */
exports.deleteUserByUserId = async (userId) => {
  const result = await UserModel.deleteOne({
    _id: mongoose.Types.ObjectId(userId)
  });
  return result.deletedCount;
}

/**
 *
 *
 * @param {string} userId - userId
 * @param {{name: string, dob: string, address: string, description: string}} options - options
 * @returns {number} - modified rows count
 */
exports.updateUserByUserId = async (userId, options) => {
  const result = await UserModel.updateOne({
    _id: mongoose.Types.ObjectId(userId)
  }, options);
  return result.nModified;
}
