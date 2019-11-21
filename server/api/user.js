const User = require('../models/user');

module.exports = {
  async users(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.pageSize || 20;
      const skip = (page - 1) * limit;
      const where = {
        status: {
          $ne: -1
        }
      };
      const users = await User.find(where, null, { skip, limit });
      const total = await User.countDocuments();

      return res.json({
        message: 'ok',
        code: 0,
        data: {
          list: users,
          page: page,
          pageSize: limit,
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
  },
  async update(req, res, next) {
    try {
      const body = req.body || {};
      const dob = new Date(body.birthday);
      const location = body.location;
      const address = body.address || '';
      const description = body.description || '';
      const userId = req.params.userId;
      const record = await User.findById(userId);
      if (!record) {
        return res.status(404).json({
          message: 'record not found',
          code: 10404
        });
      }

      // only owner or admin
      if (record.name !== req.user.username && !req.user.isAdmin) {
        return res.status(401).json({
          message: 'permission deny',
          code: 11401
        });
      }

      if (dob.toString() !== 'Invalid Date') {
        record.dob = dob;
      }

      if (address) {
        record.address = address;
      }

      if (description) {
        record.description = description;
      }

      if (Array.isArray(location) && location.length === 2) {
        record.location = location;
      }

      await record.save();

      return res.json({
        message: 'ok',
        code: 0
      });
    } catch (err) {
      next(err);
    }
  },
  /**
   * delete user. It is not safety to drop user from db.
   * In this case, I just set the user status to -1
   * @param {Object} req Request Instance
   * @param {Object} res Response
   * @param {Function} next
   */
  async remove(req, res, next) {
    try {
      const user = req.user;
      const userId = req.params.userId;
      const record = await User.findById(userId);
      if (!record) {
        return res.status(404).json({
          message: 'message not found',
          code: 10404
        });
      }

      if (record.name !== user.username && !user.isAdmin) {
        return res.status(401).json({
          message: 'permission deny',
          code: 11401
        });
      }

      record.status = -1;
      await record.save();

      res.json({
        message: 'ok',
        code: 0
      });
    } catch (err) {
      next(err);
    }
  }
};
