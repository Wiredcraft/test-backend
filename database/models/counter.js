const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 1 },
}, {collection: 'counter'});

module.exports = mongoose.model('counter', counterSchema);
