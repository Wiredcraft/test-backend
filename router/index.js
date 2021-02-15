/* eslint-disable global-require */
const Router = require('@koa/router');
const config = require('config');
const Joi = require('joi');

const apis = [
  require('./user'),
]

const koaRouter = new Router({
  prefix: config.get('routerPrefix') || '',
});

const optionsSchema = Joi.object({
  apiInfo: Joi.object({
    path: Joi.string().required(),
    validate: Joi.object().required(),
    skipAuth: Joi.boolean()
  }).required(),
  middlewares: Joi.array().required()
}).required();

const UserRouter = function () {};
['get', 'post', 'put', 'del'].forEach((method) => {
  UserRouter.prototype[method] = (apiInfo, middlewares) => {
    const result = optionsSchema.validate({
      apiInfo, middlewares
    });
    if (result.error) {
      throw new Error('Router Register Error');
    }

    const { path, validate: apiSchema, skipAuth } = apiInfo;

    if (skipAuth) {
      koaRouter[method](path, async (ctx, next) => {
        const apiResult = apiSchema.validate({
          body: ctx.request.body,
          query: ctx.request.query,
          params: ctx.request.params
        });
        if (apiResult.error) {
          throw apiResult.error;
        }

        ctx.validation = apiResult.value;
        await next();
      }, ...middlewares);
    } else {
      // TODO, add auth middleware
    }
  };
});

const userRouter = new UserRouter();
apis.forEach((apiModule) => {
  apiModule(userRouter);
})

module.exports.register = (app) => {
  app.use(koaRouter.routes());
  app.use(koaRouter.allowedMethods());
};
