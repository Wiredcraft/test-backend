'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class UserService extends Service {
  async createUser(userOpt) {
    const { ctx } = this;
    userOpt.pwd = ctx.helper.md5Encrypto(userOpt.pwd);
    const user = await ctx.model.User.create(userOpt); // 插入一条
    delete user.dataValues.pwd;
    return user;
  }

  async findUsers(query = {}, offset = 0, limit = 20) {
    // console.log('opt:', opt);
    if (!query.deletedAt) {
      query.deletedAt = null;
    }
    return this.ctx.model.User.findAndCountAll({
      attributes: {
        exclude: ['pwd']
      },
      where: query,
      offset,
      limit
    });
  }

  async getUserById(id) {
    return this.ctx.model.User.findOne({
      attributes: {
        exclude: ['pwd']
      },
      where: {
        id
      }
    });
  }

  async updateUserById(id, userOpt) {
    return this.ctx.model.User.update(userOpt, {
      where: {
        id
      }
    });
  }

  /**
   * soft delete
   * @param {*} id
   * @returns
   */
  async deleteUserById(id) {
    return this.ctx.model.User.update(
      {
        deletedAt: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      },
      {
        where: {
          id
        }
      }
    );
  }

  async checkUsername(name) {
    const user = await this.ctx.model.User.findOne({
      where: {
        name,
        deletedAt: null
      }
    });
    return user && user.id ? true : false;
  }
}
module.exports = UserService;
