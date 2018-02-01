const httpStatus = require('http-status');
const User = require('../models/user');
const APIError = require('../helpers/APIError');

const UserController = {
  create(req, res, next) {
    User.create(req.body)
      .then(newUser => res.json(newUser))
      .catch(next);
  },
  read(req, res, next) {
    User.findOne({ _id: req.params.userId })
      .then(user => res.json(user))
      .catch(next);
  },
  update(req, res, next) {
    User.findByIdAndUpdate({ _id: req.params.userId }, { $set: req.body }, { new: true })
      .then(savedUser => res.json(savedUser))
      .catch(next);
  },
  delete(req, res, next) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then(deletedUser => res.json(deletedUser))
      .catch(next);
  },
};

module.exports = UserController;
