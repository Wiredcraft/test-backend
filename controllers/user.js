const httpStatus = require('http-status');
const User = require('../models/user');
const APIError = require('../helpers/APIError');
const utils = require('../helpers/utils');

const UserController = {
  create(req, res, next) {
    User.create(req.body)
      .then(newUser => res.json(newUser))
      .catch(next);
  },
  read(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, req.user, next);
    User.findOne({ _id: userId })
      .then((user) => {
        if (!user) {
          return next(new APIError(
            'Not Found',
            httpStatus.NOT_FOUND
          ));
        }
        return res.json(user);
      })
      .catch(next);
  },
  readMe(req, res) {
    return res.json(req.user);
  },
  update(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, req.user, next);
    User.findByIdAndUpdate({ _id: req.params.userId }, { $set: req.body }, { new: true })
      .then((user) => {
        if (!user) {
          return next(new APIError(
            'Not Found',
            httpStatus.NOT_FOUND
          ));
        }
        return res.json(user);
      })
      .catch(next);
  },
  updateMe(req, res, next) {
    User.findByIdAndUpdate({ _id: req.user.id }, { $set: req.body }, { new: true })
      .then(user => res.json(user))
      .catch(next);
  },
  delete(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, req.user, next);
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) => {
        if (!user) {
          return next(new APIError(
            'Not Found',
            httpStatus.NOT_FOUND
          ));
        }
        return res.json(user);
      })
      .catch(next);
  },
  deleteMe(req, res, next) {
    User.findOneAndRemove({ _id: req.user.id })
      .then(user => res.json(user))
      .catch(next);
  },
};

module.exports = UserController;
