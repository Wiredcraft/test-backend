'use strict';

const Controller = require('egg').Controller;
class LoginController extends Controller {
  async login() {
    const { ctx, app } = this;
    const name = ctx.request.body.name || '';
    const pwd = ctx.request.body.pwd || '';
    if (!name || !pwd) {
      throw new Error('name or password can not be null');
    }

    const userInfo = await ctx.service.login.login(name, pwd);
    if (!userInfo) {
      throw new Error('name or password wrong');
    }

    console.log('userInfo:', userInfo);
    const token = app.jwt.sign({
      id: userInfo.id,
      name: userInfo.name
    });
    return ctx.body = {
      status: 'success',
      body: {
        user: userInfo,
        token
      }
    };
  }
}

module.exports = LoginController;
