'use strict';

const Controller = require('egg').Controller;

class PingController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.status = 200;
    ctx.body = 'hi, I\'m ok!';
  }
}

module.exports = PingController;
  