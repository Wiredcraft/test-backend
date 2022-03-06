'use strict';

module.exports = (app) => {
  const { router, controller, middleware } = app;
  const checkToken = middleware.checkToken;

  router.post('/user', controller.user.createUser);
  router.get('/user', checkToken(), controller.user.getUserList);
  router.get('/user/:id', checkToken(), controller.user.getUserById);
  router.put('/user/:id', checkToken(), controller.user.updateUserById);
  router.delete('/user/:id', checkToken(), controller.user.deleteUserById);
};
