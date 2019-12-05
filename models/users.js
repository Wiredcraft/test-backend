let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectID = require('mongodb').ObjectID;

const UsersSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  dob: {
    type: Date,
    required: true,
    index: true
  },
  address: {
    type: String,
    required: true,
    trim: true,
    index: true
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
 * Use a compound index to prevent duplicate users
 **/
UsersSchema.index({name: 1, dob: 1, address: 1}, {unique: true});

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

const Users = mongoose.model('Users', UsersSchema);

Users.init().then(() => {
    console.log("Users initialized...");
});

module.exports = Users;
