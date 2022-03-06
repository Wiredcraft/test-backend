'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const _ = require('lodash');

const createUserValidate = {
  name: 'userName',
  pwd: 'password',
  dob: {
    type: 'dob',
    required: false
  },
  address: {
    type: 'string',
    required: false
  },
  description: {
    type: 'string',
    required: false
  },
  latitude: {
    type: 'number',
    required: false
  },
  longitude: {
    type: 'number',
    required: false
  }
};

class UserController extends Controller {
  // get /user
  async getUserList() {
    const { ctx } = this;
    const page = +ctx.query.page || 1;
    const pagecount = +ctx.query.pagecount || 5;
    const name = ctx.query.name || '';
    const query = {};
    if (name) {
      query.name = {
        $regex: new RegExp(name, 'i')
      };
    }
    const offset = (page - 1) * pagecount;
    const { count, rows: userList } = await ctx.service.user.findUsers(query, offset, pagecount);
    return (ctx.body = {
      status: 'success',
      body: {
        count,
        userList
      }
    });
  }

  // post /user
  async createUser() {
    const { ctx } = this;
    const body = ctx.request.body;
    ctx.validate(createUserValidate, ctx.request.body);
    if (await ctx.service.user.checkUsername(body.name)) {
      throw new Error('new name has been used by others');
    }
    const userOpt = {
      name: body.name,
      pwd: body.pwd,
      dob: body.dob || '',
      address: body.address || '',
      description: body.description || '',
      latitude: body.latitude || 0,
      longitude: body.longitude || 0,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    const user = await ctx.service.user.createUser(userOpt);
    return (ctx.body = {
      status: 'success',
      body: {
        user
      }
    });
  }

  // get /user/:id
  async getUserById() {
    const { ctx } = this;
    const id = +ctx.params.id;
    const userInfo = await ctx.service.user.getUserById(id);
    if (userInfo) {
      delete userInfo.pwd;
    }
    // console.log('userInfo:', userInfo);

    return (ctx.body = {
      status: 'success',
      body: {
        user: userInfo
      }
    });
  }

  // put /user/:id
  async updateUserById() {
    const { ctx } = this;
    const userId = ctx.headers.userId;
    const id = +ctx.params.id;
    ctx.validate({ id: 'int' }, { id });
    if (userId !== id) {
      throw new Error("can not update other user's info");
    }
    const body = ctx.request.body;
    ctx.validate(createUserValidate, ctx.request.body);

    const userInfo = await ctx.service.user.getUserById(id);
    // name should be unique
    if (body.name && body.name !== userInfo.name && await ctx.service.user.checkUsername(body.name)) {
      throw new Error('new name has been used by others');
    }
    body.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    await ctx.service.user.updateUserById(
      userId,
      _.pick(body, ['name', 'pwd', 'dob', 'address', 'description', 'updatedAt'])
    );
    return (ctx.body = {
      status: 'success'
    });
  }

  // delete /user/:id
  async deleteUserById() {
    const { ctx } = this;
    const userId = ctx.headers.userId;
    const id = +ctx.params.id;
    ctx.validate({ id: 'int' }, { id });
    if (userId !== id) {
      throw new Error('can only delete yourself');
    }
    await ctx.service.user.deleteUserById(id);
    return (ctx.body = {
      status: 'success'
    });
  }
}

module.exports = UserController;
