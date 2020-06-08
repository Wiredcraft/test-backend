import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const listFriendshipsToId = async ctx => {
      if (!ctx.params.userId) throw createError(400, "id in path is required.");

      const req = {
        userId: ctx.params.userId,
        query: ctx.normalizedQuery || {},
      };

      const res = await this.listFriendshipsToId(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const listFriendshipsFromId = async ctx => {
      if (!ctx.params.userId) throw createError(400, "id in path is required.");

      const req = {
        userId: ctx.params.userId,
        query: ctx.normalizedQuery || {},
      };

      const res = await this.listFriendshipsFromId(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const createFriendship = async ctx => {
      if (!ctx.params.to) {
        throw createError(400, "two ids in path are required.");
      }

      const req = {
        from: ctx.params.from,
        to: ctx.params.to,
      };

      const res = await this.createFriendship(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 201;
    };

    const deleteFriendship = async ctx => {
      if (!ctx.params.to) {
        throw createError(400, "two ids in path are required.");
      }

      const req = {
        from: ctx.params.from,
        to: ctx.params.to,
      };

      await this.deleteFriendship(req, ctx);

      ctx.status = 204;
    };

    router.get(
      "/friendships/to/:userId",
      ...this.middlewares("listFriendshipsToId"),
      listFriendshipsToId
    );
    router.get(
      "/friendships/from/:userId",
      ...this.middlewares("listFriendshipsFromId"),
      listFriendshipsFromId
    );
    router.post(
      "/friendships/edit/:from/:to",
      ...this.middlewares("createFriendship"),
      createFriendship
    );
    router.delete(
      "/friendships/edit/:from/:to",
      ...this.middlewares("deleteFriendship"),
      deleteFriendship
    );
  }

  /**
   * implement following abstract methods in the inherited class
   */

  /**
   * Ability to inject some middlewares
   *
   * @param {string} operation name of operation
   * @returns {function[]} middlewares
   */
  middlewares(operation) {
    return [];
  }
}
