'use strict';

const Controller = require('egg').Controller;
class FriendController extends Controller {
  async followNewUser() {
    const { ctx } = this;
    const userId = ctx.headers.userId;
    const id = +ctx.params.id;

    if (id === userId) {
      throw new Error('Can not follow yourself');
    }
    const followerInfo = await ctx.service.user.getUserById(id);
    if (!followerInfo) {
      throw new Error('The Person is not exist');
    }
    const followRelation = await ctx.service.friend.checkFollowRelation(userId, id);
    console.log('relation:', followRelation);
    if (followRelation & (1 === 1)) {
      throw new Error('you have already followed');
    }
    await ctx.service.friend.createFriend(userId, id);
    return (ctx.body = {
      status: 'success'
    });
  }

  async removeFollower() {
    const { ctx } = this;
    const userId = ctx.headers.userId;
    const id = +ctx.params.id;

    const followRelation = await ctx.service.friend.checkFollowRelation(userId, id);
    if (followRelation & (1 !== 1)) {
      throw new Error('you did not follow before');
    }
    await ctx.service.friend.removeFriend(userId, id);
    return (ctx.body = {
      status: 'success'
    });
  }

  async getFollowings() {
    const { ctx } = this;
    const id = +ctx.params.id;
    const page = +ctx.query.page || 1;
    const pagecount = +ctx.query.pagecount || 20;
    const offset = (page - 1) * pagecount;

    const userInfo = await ctx.service.user.getUserById(id);
    if (!userInfo) {
      throw new Error('user is not exist');
    }

    const { count, rows: followings } = await ctx.service.friend.getFollowingIds(id, offset, pagecount);
    const followingList = await Promise.all(
      followings.map(async (item) => {
        return ctx.service.user.getUserById(item.following);
      })
    );
    return (ctx.body = {
      status: 'success',
      body: {
        count,
        followingList
      }
    });
  }

  async getFollowers() {
    const { ctx } = this;
    const id = +ctx.params.id;
    const page = +ctx.query.page || 1;
    const pagecount = +ctx.query.pagecount || 20;
    const offset = (page - 1) * pagecount;

    const userInfo = await ctx.service.user.getUserById(id);
    if (!userInfo) {
      throw new Error('user is not exist');
    }

    const { count, rows: followers } = await ctx.service.friend.getFollowerIds(id, offset, pagecount);
    const followerList = await Promise.all(
      followers.map(async (item) => {
        return ctx.service.user.getUserById(item.follower);
      })
    );
    return (ctx.body = {
      status: 'success',
      body: {
        count,
        followerList
      }
    });
  }

  async getMatualFollowers() {
    const { ctx } = this;
    const id = +ctx.params.id;
    const page = +ctx.query.page || 1;
    const pagecount = +ctx.query.pagecount || 20;
    const offset = (page - 1) * pagecount;

    const userId = ctx.headers.userId;
    if (id !== userId) {
      throw new Error('can only get your own friends');
    }
    const userInfo = await ctx.service.user.getUserById(id);
    if (!userInfo) {
      throw new Error('user is not exist');
    }

    const { count, rows: friends } = await ctx.service.friend.getFriendIds(id, offset, pagecount);
    const friendList = await Promise.all(
      friends.map(async (item) => {
        return ctx.service.user.getUserById(item.follower);
      })
    );
    return (ctx.body = {
      status: 'success',
      body: {
        count,
        friendList
      }
    });
  }

  async getNearbyFriends() {
    const { ctx } = this;
    const id = +ctx.params.id;
    const page = +ctx.query.page || 1;
    const pagecount = +ctx.query.pagecount || 5;
    const offset = (page - 1) * pagecount;

    const userId = ctx.headers.userId;
    if (id !== userId) {
      throw new Error('can only get your own friends');
    }
    const userInfo = await ctx.service.user.getUserById(id);
    if (!userInfo) {
      throw new Error('user is not exist');
    }

    const { count, rows: friends } = await ctx.service.friend.getFriendsByDistance(
      id,
      userInfo.latitude,
      userInfo.longitude,
      offset,
      pagecount
    );
    const friendList = await Promise.all(
      friends.map(async (item) => {
        const user = await ctx.service.user.getUserById(item.id);
        user.dataValues.distance = item.dist + 'km';
        return user;
      })
    );
    return (ctx.body = {
      status: 'success',
      body: {
        count,
        friendList
      }
    });
  }
}

module.exports = FriendController;
