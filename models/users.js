var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

var UsersSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UsersSchema.options.toObject = {
  virturals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret.__v;
  }
};

UsersSchema.statics.getUserById = function(user_id) {
    return  Users.findOne( { '_id': ObjectID(user_id)} );
}

var Users = mongoose.model('Users', UsersSchema);
module.exports = Users;
