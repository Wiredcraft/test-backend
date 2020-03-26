'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // health inspection interface
  router.get('/ping', controller.ping.index);

  router.get('/', 'home.render');

  // The mount below is syntactic sugar, which is equivalent to
  // const auth0 = app.passport.authenticate('auth0', {});
  // router.get('/passport/auth0', auth0);
  // router.get('/passport/auth0/callback', auth0);
  app.passport.mount('auth0');

  router.resources('users', '/api/v1/users', app.controller.users);

  router.get('/logout', 'users.logout');
};
