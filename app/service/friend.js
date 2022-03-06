'use strict';

const Service = require('egg').Service;
const moment = require('moment');
const { QueryTypes } = require('sequelize');

class LoginService extends Service {
  /**
   *
   * @param {int} user1
   * @param {int} user2
   * @returns flag  0x00: no follow relationship
   * 0x01: user1 follow user2
   * 0x10: user2 follow user1
   * 0x11: user1 and user2 follow each other
   */
  async checkFollowRelation(user1, user2) {
    const { ctx } = this;
    const follow1 = await ctx.model.Friend.findOne({
      where: {
        following: user1,
        follower: user2
      }
    });
    const follow2 = await ctx.model.Friend.findOne({
      where: {
        following: user2,
        follower: user1
      }
    });
    let flag = 0;
    if (follow1) {
      flag |= 1;
    }
    if (follow2) {
      flag |= 2;
    }
    return flag;
  }

  /**
   * 
   * @param {int} user1 
   * @param {int} user2 
   * @returns User
   */
  async createFriend(user1, user2) {
    return this.ctx.model.Friend.create({
      following: user1,
      follower: user2,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
    });
  }

  /**
   * 
   * @param {int} user1 
   * @param {int} user2 
   * @returns 
   */
  async removeFriend(user1, user2) {
    return this.ctx.model.Friend.destroy({
      where: {
        following: user1,
        follower: user2
      }
    });
  }

  /**
   * get rows and count of users who follow userId
   * @param {int} userId 
   * @param {int} offset 
   * @param {int} limit 
   * @returns {count: int, rows: Friend[]}
   */
  async getFollowingIds(userId, offset, limit) {
    return this.ctx.model.Friend.findAndCountAll({
      where: {
        follower: userId
      },
      offset,
      limit,
      order: [['following', 'ASC']]
    });
  }

  /**
   * get rows and count of users who followed by userId
   * @param {int} userId 
   * @param {int} offset 
   * @param {int} limit 
   * @returns {count: int, rows: Friend[]}
   */
  async getFollowerIds(userId, offset, limit) {
    return this.ctx.model.Friend.findAndCountAll({
      where: {
        following: userId
      },
      offset,
      limit,
      order: [['follower', 'ASC']]
    });
  }

  /**
   * get rows and count of users who follow userId and also followed by userId
   * @param {int} userId 
   * @param {int} offset 
   * @param {int} limit 
   * @returns {count: int, rows: Friend[]}
   */
  async getFriendIds(userId, offset, limit) {
    const followingIds = await this.ctx.model.Friend.findAll({
      where: {
        follower: userId
      }
    }).then((ret) => {
      if (!ret || !ret.length) {
        return [];
      }
      return ret.map((i) => i.following);
    });

    if (!followingIds.length) {
      return {
        count: 0,
        rows: []
      };
    }

    return this.ctx.model.Friend.findAndCountAll({
      where: {
        follower: followingIds,
        following: userId
      },
      offset,
      limit,
      order: [['following', 'ASC']]
    });
  }

  /**
   * get Friends sort by distance
   * @param {int} userId 
   * @param {float} latitude 
   * @param {float} longitude 
   * @param {int} offset 
   * @param {int} limit 
   * @returns 
   */
  async getFriendsByDistance(userId, latitude = 0, longitude = 0, offset, limit) {
    const querySql = `SELECT id, 
      ROUND(6378.138 * 2 * ASIN(
        SQRT(
          POW(
            SIN((? * PI() / 180 - latitude * PI() / 180) / 2),
            2
          )
          +
          COS(? * PI() / 180) * COS(latitude * PI() / 180)
          *
          POW(
            SIN((? * PI() / 180 - longitude * PI() / 180) / 2),
            2
          )
        )
      ) * 1000) / 1000
     AS dist
      FROM tbl_users
      WHERE id IN
      (SELECT follower as fid
      FROM tbl_friends f
      WHERE following = ?
      AND follower IN
      (SELECT following FROM tbl_friends WHERE follower = ?))
      ORDER BY dist ASC
      LIMIT ?, ?`;
    const cntSql =
      'SELECT count(*) as cnt ' +
      'FROM tbl_users ' +
      'WHERE id IN ' +
      '(SELECT follower as fid ' +
      'FROM tbl_friends f ' +
      'WHERE follower = ? ' +
      'AND following IN ' +
      '(SELECT following FROM tbl_friends WHERE follower = ?)) ';

    const cntRet = await this.ctx.model.query(cntSql, {
      replacements: [userId, userId],
      type: QueryTypes.SELECT
    });
    const count = cntRet && cntRet.length ? cntRet[0].cnt : 0;

    const queryRet = await this.ctx.model.query(querySql, {
      replacements: [latitude, latitude, longitude, userId, userId, offset, limit],
      typeof: QueryTypes.SELECT
    });
    const rows = queryRet && queryRet.length && queryRet[0].length ? queryRet[0] : [];
    return {
      count,
      rows
    };
  }
}
module.exports = LoginService;
