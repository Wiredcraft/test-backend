import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const listUsers = async ctx => {
      const req = {
        query: ctx.normalizedQuery || {},
      };

      const res = await this.listUsers(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      if (!res.headers || res.headers.xTotalCount === undefined) { throw createError(500, "should have header X-Total-Count in response"); }

      ctx.body = res.body;
      ctx.set("X-Total-Count", res.headers.xTotalCount);
      ctx.status = 200;
    };

    const createUser = async ctx => {
      const req = {
        body: ctx.request.body,
      };

      const res = await this.createUser(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const getUserById = async ctx => {
      if (!ctx.params.id) throw createError(400, "id in path is required.");

      const req = {
        id: ctx.params.id,
      };

      const res = await this.getUserById(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const updateUser = async ctx => {
      if (!ctx.params.id) throw createError(400, "id in path is required.");

      const req = {
        id: ctx.params.id,
        body: ctx.request.body,
      };

      const res = await this.updateUser(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const deleteUser = async ctx => {
      if (!ctx.params.id) throw createError(400, "userId in path is required.");

      const req = {
        id: ctx.params.id,
      };

      await this.deleteUser(req, ctx);

      ctx.status = 204;
    };

    const getFollowersById = async ctx => {
      if (!ctx.params.id) throw createError(400, "id in path is required.");

      const req = {
        id: ctx.params.id,
      };

      const res = await this.getFollowersById(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const getFollowingsById = async ctx => {
      if (!ctx.params.id) throw createError(400, "id in path is required.");

      const req = {
        id: ctx.params.id,
      };

      const res = await this.getFollowingsById(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const createFollowing = async ctx => {
      const req = {
        body: ctx.request.body,
      };

      const res = await this.createFollowing(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const deleteFollowing = async ctx => {
      const req = {
        body: ctx.request.body,
      };

      await this.deleteFollowing(req, ctx);

      ctx.status = 204;
    };

    router.get("/users", ...this.middlewares("listUsers"), listUsers);
    router.post("/users", ...this.middlewares("createUser"), createUser);
    router.get("/users/:id", ...this.middlewares("getUserById"), getUserById);
    router.patch("/users/:id", ...this.middlewares("updateUser"), updateUser);
    router.delete("/users/:id", ...this.middlewares("deleteUser"), deleteUser);
    router.get(
      "/users/:id/followers",
      ...this.middlewares("getFollowersById"),
      getFollowersById
    );
    router.get(
      "/users/:id/followings",
      ...this.middlewares("getFollowingsById"),
      getFollowingsById
    );
    router.post(
      "/followings",
      ...this.middlewares("createFollowing"),
      createFollowing
    );
    router.delete(
      "/followings",
      ...this.middlewares("deleteFollowing"),
      deleteFollowing
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
