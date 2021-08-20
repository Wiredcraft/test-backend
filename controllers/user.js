const User = require('../database/models/user');
const Result = require('../models/result');
const validationResult = require('express-validator/check').validationResult;

exports.getUser = (req, res) => {
  const id = req.params.id,
    page = parseInt(req.body.page) || 1,
    limit = parseInt(req.body.limit) || 20;

  const obj = {};
  id !== '' && id != null && (obj['_id'] = id);

  User.find(obj, {__v: 0})
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({id: 1})
    .exec((err, docs) => {
      if (err) {
        new Result('query error').fail(res);
      } else {
        new Result(docs, 'success').json(res);
      }
    });
};

exports.addUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return new Result(errors.mapped(), 'error').fail(res);
  }
  const user = new User({
    name: req.body.name,
    dob: new Date(req.body.dob),
    address: req.body.address,
    description: req.body.description,
    createdAt: new Date(),
  });
  user.save((err) => {
    if (err) {
      console.log(err);
      new Result('add error').fail(res);
    } else {
      new Result().success(res);
    }
  });
};

exports.updateUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return new Result(errors.mapped(), 'error').fail(res);
  }
  const id = req.params.id;

  const obj = {
    name: req.body.name,
    dob: new Date(req.body.dob),
    address: req.body.address,
    description: req.body.description,
  };

  User.updateOne({_id: id}, obj, (err) => {
    if (err) {
      console.log(err);
      new Result('update error').fail(res);
    } else {
      new Result().success(res);
    }
  });
};

exports.delUser = (req, res) => {
  const id = req.params.id;
  const obj = {_id: id};
  User.deleteOne(obj, (err) => {
    if (err) {
      console.log(err);
      new Result('del error').fail(res);
    } else {
      new Result().success(res);
    }
  });
};
