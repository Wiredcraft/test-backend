/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');


module.exports = {

  attributes: {
    username: {
      type: 'string',
      size: 24,
      required: true,
      unique: true
    },
    address: {
      type: 'string',
      size: 50
    },
    description: {
      type: 'text',
      size: 140
    },
    dob: {
      type: 'date',
      defaultsTo: '1900-01-01'
    },
    password: {
      type: 'string',
      required: true,
      columnName: 'hashed_password'
    },

    isAdmin: {
      type: 'boolean',
      defaultsTo: false
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  beforeCreate: function(value, cb) {
    bcrypt.hash(value.password, 8, function(err, hash) {
      if(err) return cb(err);
      value.password = hash;
      cb();
    });
  },

  authenticate: function (username, password, cb) {
    User.findOne({username: username}, function(err, user){
      if(err) return cb(err);
      if(!user) return cb(null, false, {message: 'name not found'});
      bcrypt.compare(password, user.password, function(err, res){
        if(!res) return cb(null, false, { message: 'Invalid Password' });
        return cb(null, user, { message: 'Login Succesful'});
      });
    });
  }
};
