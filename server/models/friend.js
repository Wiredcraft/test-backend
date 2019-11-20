const { Schema } = require('mongoose');
const db = require('./index');

const Friend = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User'
  },
  friendId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User'
  },
  status: {
    type: Number
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = db.model('Friend', Friend);
