'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUsersViaPageMode({ page, limit }) {
    this.logger.info(`[service.getUsersViaPageMode] page ${page}, limit: ${limit}`);
    const { ctx } = this;
    const skip = (page - 1) * limit;
    const condition = {
      status: {
        $ne: -1,
      },
    };
    try {
      const users = await ctx.model.User.find(condition).sort({ _id: -1 }).skip(skip)
        .limit(limit);
      const total = await ctx.model.User.count();
      return {
        list: users,
        page,
        pageSize: limit,
        total,
      };
    } catch (error) {
      this.logger.error('[service.getUsersViaPageMode]', error);
      return null;
    }

  }
  async getUsersViaSkipMode({ nextId, limit }) {
    this.logger.info(`[service.getUsersViaSkipMode] nextId ${nextId}, limit: ${limit}`);
    const { ctx, app } = this;
    const condition = {
      _id: { $lte: app.mongoose.Types.ObjectId(nextId) },
      status: {
        $ne: -1,
      },
    };
    try {
      const users = await ctx.model.User.find(condition).sort({ _id: -1 }).limit(limit + 1);
      let hasMore = false;
      let nextId = '';
      // via the results length to determine if there is more data
      if (users.length > limit) {
        hasMore = true;
        nextId = users[limit]._id;
      }
      return {
        list: users,
        nextId,
        hasMore,
      };
    } catch (error) {
      this.logger.error('[service.getUsersViaSkipMode]', error);
      return null;
    }
  }
}

module.exports = UserService;
