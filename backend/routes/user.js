const
  userController = require('../controller').userController;

module.exports = (app) => {
  app.get('/api/v1/user', userController.getList);
  app.post('/api/v1/user', userController.create);
  app.put('/api/v1/user/:id', userController.update);
  app.delete('/api/v1/user/:id', userController.remove);
  app.put('/api/v1/user/location/:id', userController.updateLocation);
  app.get('/api/v1/user/nearby/:id', userController.nearby);
};
