const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');


const validObjectID = new RegExp('^[0-9a-fA-F]{24}$');

module.exports = {
  isObjectID: objectID => validObjectID.test(objectID),
  isValidObjectID: (userId, next) => { // eslint-disable-line consistent-return
    if (!validObjectID.test(userId)) {
      return next(new APIError(
        'Not Found',
        httpStatus.NOT_FOUND
      ));
    }
  }
};
