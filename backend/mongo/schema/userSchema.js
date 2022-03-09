const
  mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  address: String,
  description: String,
  location : {
    type: [],
    sparse: true
  },     
  createdAt: Date   
});

userSchema.index({ location: "2dsphere" })

mongoose.model('user', userSchema);