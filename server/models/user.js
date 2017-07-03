'use strict';

module.exports = function(user) {

let methodWhiteList = [
  "create", "findById", "deleteById"
]

user.sharedClass.methods().forEach(function(method) 
{
  if (methodWhiteList.indexOf(method.name) == -1) // check if method is in the white list
  {
    	user.disableRemoteMethodByName(method.name); // Method is disable because not white-listed
  }});

// DATA Validation
// Make sure name is unique and respect length
 user.validatesUniquenessOf('name', {message: 'User Already exist'});
 user.validatesLengthOf('name', {min: 3, max: 42 , message : {
 	min : 'Name is too short', 
 	max : 'Name is too long'}});
};
