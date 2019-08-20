"use strict";
var debugEnabled = require("../../config").debug;
var log = require("color-logs")(debugEnabled, debugEnabled, __filename);
var Promise = require('promise');
var Chance = new require('chance')();

var User = require('./model');
var BaseApi = require("../../api");

class UsersController extends BaseApi {

  getUser(req, res) {
    let id = req.params.id;
    log.info("looking for user id " + id);
    User.findById(id)
      .exec((err, model) => {
        if(err) {
          return this.exception(res, err);
        } else {
          return this.success(res, model);
        }
      });
  }

  async getUsers(req, res) {
    log.info("getting users");
    await User.find()
      .sort({ "name": 1 })
      .exec( (err, models) => {
        log.info("result: ", models);
        if (err) {
          log.error(err);
          return this.exception(res, err);
        }
        return this.success(res, models);
      });
    log.info("done");
  };

  createUser(req, res) {
    var model = new User(req.body);
    return new Promise((resolve, reject) => {
      log.info("adding model ", model);
      model.save((err, model) => {
        log.info("adding model");
        if (err) {
          log.error("save user error", err);
          this.exception(res, err);
          return reject(err);
        }
        this.success(res, model);
        return resolve(model);
      });
    })
  }

  updateUser(req, res) {
    var id = req.params.id;
    User.findById(id)
      .exec((err, model) => {
        model.name = req.body.name;
        model.dob = req.body.dob;
        model.address = req.body.address;
        model.description = req.body.description;
        model.save((err, savedModel) => {
          if (err) return this.exception(res, err);
          return this.success(res, savedModel);
        });
      });
  }

  deleteUser(req, res) {
    var id = req.params.id;
    User.findById(id)
      .exec((err, model) => {
        model.active = false;
        model.save((err, savedModel) => {
          if (err) return this.exception(res, err);
          return this.success(res, savedModel);
        });
      });
  }

}

module.exports = new UsersController();
