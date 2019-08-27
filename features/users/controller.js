"use strict";
var debugEnabled = require("../../config").debug;
var log = require("color-logs")(debugEnabled, debugEnabled, __filename);
var Chance = new require('chance')();

var User = require('./model');
var Friendship = require('./friendship.service');
var BaseApi = require("../../api");

var mocks = require('../../test-helpers/_mocks');

class UsersController extends BaseApi {

  async getUserById(id) {
    try {
      let user = await User.findById(id).select(['-friends']);
      let friends = await Friendship.getFriends(id);
      return {
        user: user,
        friends: friends
      };
    } catch(ex) {
      throw ex;
    }
  }

  getUser(req, res) {
    let id = req.params.id;
    log.info("looking for user id " + id);
    this.getUserById(id)
      .then(model => this.success(res, model))
      .catch(err => this.exception(res, err));
  }

  async getUsers(req, res) {
    await User.find()
      .select(['-friends'])
      .sort({ "name": 1 })
      .exec( (err, models) => {
        if (err) {
          log.error(err);
          return this.exception(res, err);
        }
        return this.success(res, models);
      });
  };

  async getMe(req, res) {
    let data = this.getToken(req);
    log.info(data);

    try {
      let user = await this.getUserById(data.user_id);
      if (!user) {
        return this.fail(res, 401, "User not found!");
      }

      return this.success(res, user);
    } catch(ex) {
      return this.exception(res, ex);
    }
  }

  createUser(req, res) {
    var model = new User(req.body);
    return new Promise((resolve, reject) => {
      model.save((err, model) => {
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

  async meet(req, res) {
    let user = req.params.id;
    let friend = req.params.friend;
    try {
      await Friendship.makeFriend(user, friend);
      let response = await this.getUserById(user);
      return this.success(res, response);
    } catch(ex) {
      return this.exception(res, ex);
    }
  }
  async break(req, res) {
    let user = req.params.id;
    let friend = req.params.friend;
    log.info(user + " breaking up with "+ friend);
    try {
      await Friendship.breakUp(user, friend);
      let response = await this.getUserById(user);
      return this.success(res, response);
    } catch(ex) {
      return this.exception(res, ex);
    }
  }

  updateUser(req, res) {
    var id = req.params.id;
    let data = this.getToken(req);
    if(!data || data.user_id != id) return this.error(res, 401, "Denied");

    User.findById(id)
      .exec((err, model) => {
        let data = req.body;
        if(data.name) model.name = req.body.name;
        if(data.email) model.email = req.body.email;
        if(data.dob) model.dob = req.body.dob;
        if(data.address) model.address = req.body.address;
        if(data.description) model.description = req.body.description;
        model.save((err, savedModel) => {
          if (err) return this.exception(res, err);
          return this.success(res, savedModel);
        });
      });
  }

  async deleteUser(req, res) {
    var id = req.params.id;
    try {
      let user = await User.findById(id)
      await user.remove();
      return this.success(res, user);
    } catch(ex) {
      return this.exception(res, ex);
    }
  }

  mockUserData() {
    let user = mocks.Users.getRandomUser();
    user.email = user.name.replace(/\s+/g, '-') + "@wiredcraft";
    user.password = "123";
    return user;
  }

  async mockUsers(req, res) {
    let qtt = req.params.qtt;
    let added = [];
    for (var i = 0; i < qtt; i++) {
      try {
        let model = new User(this.mockUserData());
        let user = await model.save();
        added.push(user);
      } catch(ex) {
        return this.exception(res, ex);
      }
    }
    return this.success(res, added);
  }

}

module.exports = new UsersController();
