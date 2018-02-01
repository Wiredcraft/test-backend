const expressValidation = require('express-validation');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config');
const APIError = require('../helpers/APIError');

module.exports = {
  convertToApiError: (err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
      const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
      const error = new APIError(unifiedErrorMessage, err.status, true);
      return next(error);
    } else if (!(err instanceof APIError)) {
      const apiError = new APIError(err.message, err.status, err.isPublic);
      return next(apiError);
    }
    return next(err);
  },
  notFound: (req, res, next) => {
    const err = new APIError('API not found', httpStatus.NOT_FOUND);
    return next(err);
  },
  addTrace: (err, req, res, next) => // eslint-disable-line no-unused-vars
    res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
      stack: config.env !== 'test' ? err.stack : {}
    }),
  authenticate: (req, res, next) => { // eslint-disable-line consistent-return
    if (!req.headers.authorization || (req.headers.authorization && req.headers.authorization.indexOf('Bearer') === -1)) {
      return next(new APIError(
        'Failed to authenticate token',
        httpStatus.UNAUTHORIZED
      ));
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    if (token) {
      jwt.verify(token, config.jwtSecret, (err, decoded) => { // eslint-disable-line
        if (err) {
          return next(new APIError(
            'Failed to authenticate token',
            httpStatus.UNAUTHORIZED
          ));
        }
        User.findOne({ username: decoded.username })
          .then((user) => { // eslint-disable-line consistent-return
            if (!user) {
              return next(new APIError(
                'User not Found',
                httpStatus.NOT_FOUND
              ));
            }
            req.user = user;
            next();
          })
          .catch(next);
      });
    } else {
      return next(new APIError(
        'Failed to authenticate token',
        httpStatus.UNAUTHORIZED
      ));
    }
  }
};
