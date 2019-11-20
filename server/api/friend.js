const User = require('../models/user');
const Friend = require('../models/friend');
const { ObjectId } = require('mongoose').Types;

module.exports = {
  /**
   * add user friends.
   * @param {Object} req Requst
   * @param {Object} res Response
   * @param {Function} next
   */
  async add(req, res, next) {
    try {
      const user = req.user;
      const record = await User.findOne({ name: user.username });
      const body = req.body || {};
      const friendIds = body.friendIds;
      const ids = friendIds.map(item => new ObjectId(item));
      const friends = await User.find({ _id: { $in: ids } });
      const data = [];
      for (const item of friends) {
        const relation = {
          userId: record._id,
          friendId: item._id,
          status: 1
        };
        data.push(relation);
      }

      await Friend.insertMany(data);

      res.json({
        message: 'ok',
        code: 0
      });
    } catch (err) {
      next(err);
    }
  },
  async friends(req, res, next) {
    try {
      const username = req.params.username;
      const limit = Number(req.query.limit) || 100;
      const meter = Number(req.query.mile) || 1000;
      const record = await User.findOne({ name: username });
      const user = record.toObject();
      if (!user || user.status === -1) {
        return res.status(404).json({
          message: 'user not found',
          code: 10404
        });
      }

      if (Array.isArray(user.location) &&
        user.location.length === 2
      ) {
        const mapping = await Friend.find({ userId: user._id })
          .populate({
            path: 'friendId',
            select: '_id name location',
            match: {
              status: {
                $ne: -1
              },
              location: {
                $nearSphere: {
                  $geometry: {
                    type: 'Point',
                    coordinates: user.location
                  },
                  $maxDistance: meter
                }
              }
            },
            options: {
              limit: limit
            }
          }).exec();

        const friends = [];
        for (const item of mapping) {
          friends.push(item.friendId);
        }

        return res.json({
          message: 'ok',
          code: 0,
          data: {
            user,
            meter,
            limit,
            friends
          }
        });
      }

      res.json({
        message: 'ok',
        code: 0,
        data: {
          user,
          meter,
          limit,
          friends: []
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
