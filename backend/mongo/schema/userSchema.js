const
  mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  address: String,
  description: String,
  longitude: Number,
  latitude: Number,       
  createdAt: Date   
});

mongoose.model('user', userSchema);