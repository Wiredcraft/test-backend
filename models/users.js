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

/**
 * Return user objects with an id field
 * Convert Mongo generated id object and store it in 
 * user object's id field.
 **/

UsersSchema.options.toObject = {
  virturals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret.__v;
  }
};

/**
 * Return a user based on an input id
 * Param(s):
 * user_id: String
 **/

UsersSchema.statics.getUserById = function(user_id) {
    return  Users.findOne( { '_id': ObjectID(user_id)} );
}

var Users = mongoose.model('Users', UsersSchema);
module.exports = Users;
