'use strict';

const Service = require('egg').Service;

class FriendService extends Service {
  async follow({userId, target}) {
    this.logger.debug(`[service.FriendService.follow] userId ${userId}, target: ${target}`);
    const { ctx } = this;
    if (userId == target) {
      this.logger.error(`Can't follow yourself`);
      return false;
    }
    // TODO: below mongodb statements should execute in one transaction at a time
    try {
      // transaction session begin
      const _following = await ctx.model.Following.create([{
        userId: userId,
        target: target,
      }]);
      const _follower = await ctx.model.Following.create([{
        userId: target,
        target: userId,
      }]);
      const _followCount = await Promise.all([
        ctx.model.Following.findOneAndUpdate({ userId: userId }, {$inc: {'followingCount': 1}}),
        ctx.model.Following.findOneAndUpdate({ userId: target }, {$inc: {'followerCount': 1}}),
      ]);
      // transaction session end
      return true;
    } catch (error) {
      this.logger.error(`[service.FriendService.follow]`, error);
      return null;
    }
    
  }
  async unfollow({userId, target}) {
    this.logger.info(`[service.FriendService.unfollow] userId ${userId}, target: ${target}`);
    const { ctx } = this;
    // TODO: below mongodb statements should execute in one transaction at a time
    try {
      // transaction session begin
        const _followingDeleted = await ctx.model.Following.findOneAndRemove({ userId, target });
        console.log(_following, '_following')
        const _followingCount = await ctx.model.FollowCount.findOneAndUpdate({ userId }, { $inc: {'followingCount': -1 }});
        const _followerDeleted = await ctx.model.Follower.findOneAndRemove({ userId: target, target: userId });
        const _followerCount = await ctx.model.FollowCount.findOneAndUpdate({ userId }, { $inc: {'followerCount': -1 }});
        // Clean up the data to save space
        const _followCountDeleted = await ctx.model.FollowCount.findOneAndRemove({ userId: { $in: [userId, target], followingCount: 0, followerCount: 0} });
      // transaction session end
      return true;
    } catch (error) {
        this.logger.error(`[service.FriendService.unfollow]`, error);
        return null;
    }
  }

  async getFollowings({userId, nextId, limit=20}) {
    this.logger.debug(`[service.friend.getFollowings] userId: ${userId}`);
    const { ctx, app } = this;
    const condition = { userId };
    if (nextId) {
      Object.assign(condition, {_id: { $lte: app.mongoose.Types.ObjectId(nextId) }})
    }
    const result = await ctx.model.Following
      .find(condition)
      .populate('target').order('_id -1').limit(limit + 1);
    
    let hasMore = false;
    let nextId = null;
    if (result.length > limit) {
      hasMore = true;
      nextId = result[limit]._id;
    }

    return {
      result,
      hasMore,
      nextId
    }
  }
  async getFollowers({userId, nextId, limit=20}) {
    this.logger.debug(`[service.friend.getFollowers] userId: ${userId}`);
    const { ctx, app } = this;
    const condition = { userId };
    if (nextId) {
      Object.assign(condition, {_id: { $lte: app.mongoose.Types.ObjectId(nextId) }})
    }
    const result = await ctx.model.Follower
      .find(condition)
      .populate('target').order('_id -1').limit(limit + 1);
    
    let hasMore = false;
    let nextId = null;
    if (result.length > limit) {
      hasMore = true;
      nextId = result[limit]._id;
    }

    return {
      result,
      hasMore,
      nextId
    }
  }
}

module.exports = FriendService;