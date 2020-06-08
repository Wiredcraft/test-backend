import API from "../api/friendships";
import { FriendshipModel, UserModel } from "../models";
import { isObjectId } from "../lib/utils";

export class Service extends API {
  /**
   * Ability to inject some middlewares
   *
   * @param {string} operation name of operation
   * @returns {function[]} middlewares
   */
  middlewares(operation) {
    const load = async (ctx, next) => {
      await next();
    };
    return [load];
  }

  /**
   * List who is following user {userId}
   *
   * @param {ListFriendshipsToIdRequest} req listFriendshipsToId request
   * @param {import("koa").Context} ctx koa context
   * @returns {ListFriendshipsToIdResponse} Expected response to a valid request
   */
  async listFriendshipsToId(req, ctx) {
    const { limit = 10, offset = 0, sort, filter = {} } = req.query;
    filter.to = ctx.params.userId;
    const friendships = await FriendshipModel.list({
      limit,
      offset,
      sort,
      filter,
    });
    const froms = friendships.docs.map(f => f.from);
    const result = await UserModel.find({ _id: { $in: froms } });

    return {
      body: result,
      headers: {
        xTotalCount: result.total,
      },
    };
  }

  /**
   * List who user {userId} is following
   *
   * @param {LlistFriendshipsFromIdRequest} req listFriendshipsFromId request
   * @param {import("koa").Context} ctx koa context
   * @returns {ListFriendshipsFromIdResponse} Expected response to a valid request
   */
  async listFriendshipsFromId(req, ctx) {
    const { limit = 10, offset = 0, sort, filter = {} } = req.query;
    filter.from = ctx.params.userId;
    const friendships = await FriendshipModel.list({
      limit,
      offset,
      sort,
      filter,
    });
    const tos = friendships.docs.map(f => f.to);
    const result = await UserModel.find({ _id: { $in: tos } });
    return {
      body: result,
      headers: {
        xTotalCount: result.total,
      },
    };
  }

  /**
   * Create a friendship
   *
   * @param {CreateFriendshipsRequest} req createFriendships request
   * @param {import("koa").Context} ctx koa context
   * @returns {CreateFriendshipsResponse} The Friendship created
   */
  async createFriendship(req, ctx) {
    const { from, to } = ctx.params;

    if (from === to) ctx.throw(400, "Wrong id!");
    if (!isObjectId(from) || !isObjectId(to)) ctx.throw(400, "Wrong id!");
    const users = await UserModel.find({ _id: { $in: [from, to] } });
    if (users.length !== 2) ctx.throw(400, "Wrong id!");
    const repeatFriendship = await FriendshipModel.findOne({ from, to });
    if (repeatFriendship) ctx.throw(400, "Friendship already exists!");

    const friendship = await FriendshipModel.create({ from, to });
    return { body: friendship };
  }

  /**
   * Delete friendship by users id
   *
   * @param {DeleteFriendshipRequest} req deleteFriendship request
   * @param {import("koa").Context} ctx koa context
   */
  async deleteFriendship(req, ctx) {
    const { from, to } = ctx.params;
    const friendship = await FriendshipModel.findOne({ from, to });
    if (friendship) await friendship.delete();
    else throw ctx.throw(404, "Friendship dosen't exist!");
  }
}

const service = new Service();
export default service;
