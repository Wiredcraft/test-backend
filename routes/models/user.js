var model = require('../model.js');

module.exports = function (db) {
  return model(db, 'user',
    {
      created_at: (new Date()).toISOString()
    }, {
      validate_doc_update: function (newDoc, oldDoc, userCtx) {
        // CouchDB
        var require = function (field, message) {
          message = message || "Document must have a " + field;
          // FIXME it seems impossible to send a bad_request error with CouchDB, it crashes when i do that
          if (!newDoc[field]) throw({forbidden: message});
        };

        require("name");
        require("address", 'Document must have an address');
        require("dob", 'Document must have a date of birth [dob]');
        require("description");
      }
  });
};
