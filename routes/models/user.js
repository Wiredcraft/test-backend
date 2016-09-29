var model = require('../model.js');

module.exports = function (db) {
  return model(db, 'user', function (newDoc, oldDoc, userCtx) {
    // CouchDB
    if (typeof newDoc.created_at === 'undefined') {
      newDoc.created_at = (new Date()).toISOString();
    }

    validate([
      newDoc.name, 'User must have a name',
      newDoc.address, 'User must have an address',
      newDoc.dob, 'User must have a date of birth [dob]',
      newDoc.description, 'User must have description'
    ]);
  });
};
