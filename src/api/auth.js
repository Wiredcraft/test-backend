import createError from "http-errors";

export default class API {
  /**
   * Bind service to router
   *
   * @param {Object} router the koa compatible router
   */
  bind(router) {
    const reqGithub = async ctx => {
      const req = {
        query: ctx.normalizedQuery || {},
      };

      this.reqGithub(req, ctx);

      // if (!res.body) throw createError(500, "should have body in response");

      // ctx.body = res.body;
      // ctx.status = 200;
    };

    const reqGithubCallback = async ctx => {
      const req = {
        query: ctx.normalizedQuery || {},
      };

      const res = await this.reqGithubCallback(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    const login = async ctx => {
      const req = {
        body: ctx.request.body,
      };

      const res = await this.login(req, ctx);

      if (!res.body) throw createError(500, "should have body in response");

      ctx.body = res.body;
      ctx.status = 200;
    };

    router.get("/auth/github", ...this.middlewares("reqGithub"), reqGithub);
    router.get(
      "/auth/github/callback",
      ...this.middlewares("reqGithubCallback"),
      reqGithubCallback
    );
    router.post("/auth/login", ...this.middlewares("login"), login);
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
