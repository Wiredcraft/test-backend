
const userValidate = require('../validation/user');
const userMiddleware = require('../middleware/users');

module.exports = (api) => {
  api.post(
    {
      path: '/users',
      validate: userValidate.postUser,
      skipAuth: true,
    },
    [
      userMiddleware.createUser,
    ]
  );

  api.get(
    {
      path: '/users/:userId',
      validate: userValidate.getUser, // TODO, More combinations of parameters
      skipAuth: true,
    },
    [
      userMiddleware.getUser,
    ]
  );

  api.del(
    {
      path: '/users/:userId',
      validate: userValidate.deleteUser,
      skipAuth: true,
    },
    [
      userMiddleware.deleteUser
    ]
  );

  api.put(
    {
      path: '/users/:userId',
      validate: userValidate.putUser, // TODO, More combinations of parameters
      skipAuth: true,
    },
    [
      userMiddleware.updateUser
    ]
  )
}
