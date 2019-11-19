const User = require('../models/user');

module.exports = {
  async users(req, res, next) {
    try {
      const page = req.query.page || 1;
      const pageSize = req.query.pageSize || 20;
      const skip = (page - 1) * pageSize;
      const where = {
        status: {
          $ne: -1
        }
      };
      const users = await User.find(where).skip(skip).limit(pageSize);
      const total = await User.countDocuments();

      return res.json({
        message: 'ok',
        code: 0,
        data: {
          list: users,
          page: page,
          pageSize: pageSize,
          total: total
        }
      });
    } catch (err) {
      next(err);
    }
  },
  async profile(req, res, next) {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user || user.status === -1) {
        return res.status(400).json({
          message: 'user not found',
          code: 11404
        });
      }

      return res.json({
        message: 'ok',
        code: 0,
        data: user
      });
    } catch (err) {
      next(err);
    }
  }
};
