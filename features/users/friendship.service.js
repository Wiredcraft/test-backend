"use strict";
var debugEnabled = require("../../config").debug;
var log = require("color-logs")(debugEnabled, debugEnabled, __filename);
var Promise = require('promise');
var Chance = new require('chance')();

var User = require('./model');

class FriendshipService {

  async makeFriend(user_id, friend_id) {
    try {
      await User.updateOne(
        { _id: user_id }, 
        { $push: { "friends": friend_id } },
      );
      await User.updateOne(
        { _id: friend_id }, 
        { $push: { "friends": user_id } },
      );
      return true;
    } catch(err) {
      log.error(err);
      throw err;
    }
  }

  async breakUp(user, friend) {
   try {
      await User.updateOne(
        { _id: user }, 
        { $pull: { "friends": friend } },
        {},
        (err, data) => {
          if (err) { log.error(err); throw err; }
        });
      await User.updateOne(
        { _id: friend }, 
        { $pull: { "friends": user } },
        {},
        (err, data) => {
          if (err) { log.error(err); throw err; }
        });
      return true;
    } catch(err) {
      log.error(err);
      throw err;
    }
  }

  async getFriends(user_id) {
    let user = await User
      .findById(user_id)
      .populate("friends");
    let friends = user.friends.map((f) => {
      return { id: f.id, name: f.name, email: f.email, birthday: f.dob };
    }).reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) return acc.concat([current]);
      else return acc;
    }, []);
    return friends;
  }

}

module.exports = new FriendshipService();
