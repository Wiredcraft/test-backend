import { pick } from "lodash";

import API from "../api/users";
import { UserModel, PasswordModel } from "../models";
import { DEFAULT_PWD } from "../config";
import { pwdEncrypt } from "../lib/utils";

export class Service extends API {
  /**
   * Ability to inject some middlewares
   *
   * @param {string} operation name of operation
   * @returns {function[]} middlewares
   */
  middlewares(operation) {
    const load = async (ctx, next) => {
      const { id } = ctx.params;
      if (id) {
        ctx.state.user = await UserModel.get(id);
        if (!ctx.state.user) {
          throw ctx.throw(404, `user ${id} not found.`);
        }
      }
      await next();
    };
    return [load];
  }

  /**
   * List all users
   *
   * @param {ListUsersRequest} req listUsers request
   * @param {import("koa").Context} ctx koa context
   * @returns {ListUsersResponse} A paged array of users
   */
  async listUsers(req, ctx) {
    const { limit = 10, offset = 0, sort, filter = {} } = req.query;

    const result = await UserModel.list({ limit, offset, sort, filter });

    return {
      body: result.docs,
      headers: {
        xTotalCount: result.total,
      },
    };
  }

  /**
   * Create a user
   *
   * @param {CreateUsersRequest} req createUsers request
   * @param {import("koa").Context} ctx koa context
   * @returns {CreateUsersResponse} The User created
   */
  async createUser(req, ctx) {
    const { body } = req;
    const { name } = body;
    if (!name) {
      throw ctx.throw(404, "user name not found.");
    }
    const repeatUser = await UserModel.findOne({ name });
    if (repeatUser) {
      if (ctx) throw ctx.throw(404, "user already exsists");
      else return;
    }
    const user = await UserModel.create(body);
    await PasswordModel.create({
      user: user.id,
      password: pwdEncrypt(DEFAULT_PWD),
    });
    return { body: user };
  }

  /**
   * Find user by id
   *
   * @param {GetUserByIdRequest} req getUserById request
   * @param {import("koa").Context} ctx koa context
   * @returns {GetUserByIdResponse} Expected response to a valid request
   */
  async getUserById(req, ctx) {
    return { body: ctx.state.user };
  }

  /**
   * Update user
   *
   * @param {UpdateUserRequest} req updateUser request
   * @param {import("koa").Context} ctx koa context
   * @returns {UpdateUserResponse} The user
   */
  async updateUser(req, ctx) {
    const user = ctx.state.user;
    const doc = pick(req.body, [
      "name",
      "dob",
      "address",
      "description",
      "github",
    ]);
    await user.set(doc).save();
    return { body: user };
  }

  /**
   * Delete user by id
   *
   * @param {DeleteUserRequest} req deleteUser request
   * @param {import("koa").Context} ctx koa context
   */
  async deleteUser(req, ctx) {
    await ctx.state.user.delete();
  }
}

const service = new Service();
export default service;
