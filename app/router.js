'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // health inspection interface
  router.get('/ping', controller.ping.index);
  router.resources('users', '/api/v1/users', app.controller.users);
};
