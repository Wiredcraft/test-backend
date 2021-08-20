const mongoose = require('mongoose');
const Counter = require('./counter');

const userSchema = mongoose.Schema({
  id: Number, // user ID
  name: String, // user name
  dob: Date, // date of birth
  address: String, // user address
  description: String, // user description
  createdAt: Date, // user created date
}, {collection: 'user'});

// id counter
userSchema.pre('save', function(next) {
  let doc = this;
  Counter.findByIdAndUpdate({_id: 'userid'}, {$inc: {sequence_value: 1}}, {
    new: true,
    upsert: true,
  }, function(error, counter) {
    if (error) {
      return next(error);
    }
    doc.id = counter.sequence_value;
    next();
  });
});

module.exports = mongoose.model('user', userSchema);
