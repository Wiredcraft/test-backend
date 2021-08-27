const User = require('../database/models/user');
const Result = require('../models/result');
const {validationResult} = require('express-validator');

// get user by id or get all users
exports.getUser = (req, res) => {
  const id = req.params.id,
    page = parseInt(req.query.page) || 1,
    limit = parseInt(req.query.limit) || 20;

  const obj = {};
  id !== '' && id != null && (obj['_id'] = id);
  User.countDocuments({}, (error, count) => {
    if (error) {
      return new Result('query error').fail(res.status(500));
    }
    User.find(obj, {__v: 0})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({_id: 1})
      .exec((err, docs) => {
        if (err) {
          new Result('query error').fail(res.status(400));
        } else {
          new Result({data: docs, total: count}, 'success').json(res.status(200));
        }
      });
  });
};

// add a user
exports.addUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return new Result(errors.mapped(), 'error').fail(res.status(400));
  }
  const user = new User({
    name: req.body.name,
    dob: req.body.dob,
    address: req.body.address,
    description: req.body.description,
    createdAt: new Date(),
  });
  user.save((err) => {
    if (err) {
      console.log(err);
      new Result('add error').fail(res.status(400));
    } else {
      new Result().success(res.status(201));
    }
  });
};

// update user by id
exports.updateUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return new Result(errors.mapped(), 'error').fail(res.status(400));
  }

  const id = req.params.id, obj = {};

  if (req.body.name && req.body.name !== '') obj.name = req.body.name;
  if (req.body.dob && req.body.dob !== '') obj.dob = req.body.dob;
  if (req.body.address && req.body.address !== '') obj.address = req.body.address;
  if (req.body.description) obj.description = req.body.description;

  User.updateOne({_id: id}, obj, (err) => {
    if (err) {
      console.log(err);
      new Result('update error').fail(res.status(400));
    } else {
      new Result().success(res.status(200));
    }
  });
};

// delete user by id
exports.delUser = (req, res) => {
  const id = req.params.id;
  const obj = {_id: id};
  User.deleteOne(obj, (err) => {
    if (err) {
      console.log(err);
      new Result('del error').fail(res.status(400));
    } else {
      new Result().success(res.status(200));
    }
  });
};
