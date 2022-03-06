'use strict';

const Service = require('egg').Service;

class LoginService extends Service {
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
