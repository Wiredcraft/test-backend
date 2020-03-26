'use strict';

const Controller = require('egg').Controller;

class UsersController extends Controller {
  /**
   * Retrieves users with optional query params, e.g limit or skip
   * 
   * @param {Number} [limit] the users to retrieve limit
   * @param {Number} [pageNum] the users to retrieve pageNum
   * @param {Number} [nextId] start the query with this user ID in sikp mode
   * @param {String="page", "skip"} mode paging mode 
   */
  async index() {
    const { ctx } = this;
    const page = ctx.query.pageNum || 1;
    const limit = ctx.query.limit || 20;
    const nextId = ctx.query.nextId;
    const mode = ctx.query.mode;
    let ret;
    if (mode === 'page') {
      ret = await ctx.service.user.getUsersViaPageMode({page, limit});
    } else if (mode === 'skip') {
      if (!nextId) {
        return ctx.body = {
          message: 'invalid params, nextId must be provided in skip mode',
          code: 10400
        }
      }
      ret = await ctx.service.user.getUsersViaSkipMode({nextId, limit});
    } else {
      return ctx.body = {
        message: 'invalid params, mode must be provided',
        code: 10400
      }
    }

    return ctx.body = {
      message: 'ok',
      code: 0,
      data: ret
    };
  }
  /**
   * Retrieves a user with the given ID
   * 
   * @param {String} userId the users ID to retrieve
   */
  async show() {
    const { ctx, app } = this;
    this.logger.debug('[users.show] the given user ID is', ctx.params.id);
    const showRule = {
      id: {
        type: 'string',
        required: true,
        allowEmpty: false,
        trim: true,
        format: /^[a-z_0-9]{24}$/
      },
    };
    // throws exceptions if the verification fails
    const errors = app.validator.validate(showRule, ctx.params);
    if (errors) {
      return ctx.body = {
        message: `filed ${errors[0].field} ${errors[0].message}`,
        code: 10500
      }
    }
    const userId = ctx.params.id;
    const user = await ctx.model.User.findById(userId);
    if (!user) {
      return ctx.body = {
        message: 'user not found',
        code: 10404
      }
    }
    return ctx.body = {
      message: 'ok',
      code: 0,
      data: user
    };
  }
  /**
   * Validates the given data and creates a user
   * Create a user via singup with google
   * @param {Object} data the information to create a new user with
   */
  async create() {
    throw new Error('NOT_IMPLEMENTED');
  }
  /**
   * Validates the given data and then updates the user
   * 
   * @param {String} userId the user to update's ID 
   * @param {Object} data properties of the user to update
   */
  async edit() {
    this.logger.debug(`[controller.edit] params: ${JSON.stringify(ctx.params)}, body: JSON.stringify(ctx.body)`);
    try {
      // singin user
      const currentUser = ctx.user.userId;
      const body = ctx.body || {};
      const dob = new Date(body.birthday);
      const location = body.location;
      const address = body.address || '';
      const description = body.description || '';
      const userId = ctx.params.userId;
      const _user = await ctx.model.User.findById(userId);
      if (!_user) {
        ctx.status = 404;
        return ctx.body = {
          message: 'user not found',
          code: 10404
        };
      }

      // only owner or admin can edit this
      if (currentUser !== userId && !ctx.user.isAdmin) {
        return res.status(401).json({
          message: 'permission deny',
          code: 10401
        });
      }

      if (dob.toString() !== 'Invalid Date') {
        _user.dob = dob;
      }

      if (address) {
        _user.address = address;
      }

      if (description) {
        _user.description = description;
      }

      if (Array.isArray(location) && location.length === 2) {
        _user.location = location;
      }

      await _user.save();
      return this.ctx.status = 204;
    } catch (err) {
      this.logger.error('[controller.users.edit] internal error', error);
      return this.ctx.status = 500;
    }
  }
  /**
   * Deletes the user
   * 
   * @param {String} userId the user to delete's ID
   */
  async destroy () {
    this.logger.debug(`[controller.destroy] params: ${JSON.stringify(ctx.params)}, body: JSON.stringify(ctx.body)`);
    try {
      const isAdmin = ctx.user.isAdmin;
      const userId = ctx.params.userId;
      const _user = await ctx.model.User.findById(userId);
      if (!record) {
        return res.status(404).json({
          message: 'message not found',
          code: 10404
        });
      }
      // only admin can delete this
      if (!isAdmin) {
        this.ctx.status = 401;
        return this.ctx.body = {
          message: 'permission deny',
          code: 10401
        };
      }

      _user.status = -1;
      await _user.save();

      this.ctx.body = {
        message: 'ok',
        code: 0
      };
    } catch (err) {
      this.logger.error('[controller.users.destroy] internal error', error);
      return this.ctx.status = 500;
    }
  }
}

module.exports = UsersController;
