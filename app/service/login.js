'use strict';

const Service = require('egg').Service;

class LoginService extends Service {
  /**
   * return User if name match pwd
   * @param {string} name 
   * @param {string} pwd 
   * @returns User | null
   */
  async login(name, pwd) {
    const { ctx } = this;
    pwd = ctx.helper.md5Encrypto(pwd);
    const user = await ctx.model.User.findOne(
      {
        attributes: {
          exclude: ['pwd']
        },
        where: {
          name,
          pwd,
          deletedAt: null
        }
      }
    );
    return user;
  }
}
module.exports = LoginService;
