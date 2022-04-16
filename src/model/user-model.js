const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const userCollectionName = process.env.MONGODB_COLLECTION_NAME_USER || 'User';

let userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String },
  dob: { type: String },
  address: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {timestamps: {}});

userSchema.index({ id: 1 }, { unique: true });

userSchema.plugin(mongoosePaginate);

module.exports = {
  getUserModel: function(dbConnection) {
    return dbConnection.model(userCollectionName, userSchema);
  },
};
