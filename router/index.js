/* eslint-disable global-require */
const Router = require('@koa/router');
const config = require('config');

const apis = [
  require('./user'),
]

const router = new Router({
  prefix: config.get('routerPrefix') || '',
});

apis.forEach((item) => {
  item(router);
})

module.exports.register = (app) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
};
