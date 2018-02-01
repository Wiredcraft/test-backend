const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');


const validObjectID = new RegExp('^[0-9a-fA-F]{24}$');

module.exports = {
  isObjectID: objectID => validObjectID.test(objectID),
  isValidObjectID: (userId, user, next) => { // eslint-disable-line consistent-return
    if (!validObjectID.test(userId)) {
      return next(new APIError(
        'Not Found',
        httpStatus.NOT_FOUND
      ));
    }
    if (userId !== user.id) {
      return next(new APIError(
        'Failed to authenticate token',
        httpStatus.UNAUTHORIZED
      ));
    }
  }
};
