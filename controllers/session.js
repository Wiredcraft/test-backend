const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const APIError = require('../helpers/APIError');
const config = require('../config');

const SessionController = {
  create(req, res, next) {
    User.findOne({
      username: req.body.username,
    })
      .then((user) => {
        if (!user || !user.authenticate(req.body.password)) {
          const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
          return next(err);
        }
        const token = jwt.sign(
          { id: user.id, username: user.username },
          config.jwtSecret
        );

        return res.json({
          token,
        });
      })
      .catch(next);
  }
};

module.exports = SessionController;
