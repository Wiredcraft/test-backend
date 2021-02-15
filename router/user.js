const _ = require('lodash');

const userValidate = require('../validation/user');
const model = require('../model');

module.exports = (api) => {
  api.post(
    {
      path: '/users',
      validate: userValidate.postUser,
      skipAuth: true,
    },
    [
      async (ctx, next) => {
        const options = {
          name: _.get(ctx, 'validation.body.name'),
          dob: _.get(ctx, 'validation.body.dob'),
          address: _.get(ctx, 'validation.body.address'),
          description: _.get(ctx, 'validation.body.description'),
        };

        ctx.data = await model.users.insertUser(options);
        await next();
      }
    ]
  );

  api.get(
    {
      path: '/users/:userId',
      validate: userValidate.getUser,
      skipAuth: true,
    },
    [
      async (ctx, next) => {
        const userId = _.get(ctx, 'validation.params.userId');

        ctx.data = await model.users.getUserByUserId(userId);
        await next();
      }
    ]
  );

  api.del(
    {
      path: '/users/:userId',
      validate: userValidate.deleteUser,
      skipAuth: true,
    },
    [
      async (ctx, next) => {
        const userId = _.get(ctx, 'validation.params.userId');

        ctx.data = await model.users.deleteUserByUserId(userId);
        await next();
      }
    ]
  );

  api.put(
    {
      path: '/users/:userId',
      validate: userValidate.putUser,
      skipAuth: true,
    },
    [
      async (ctx, next) => {
        const userId = _.get(ctx, 'validation.params.userId');

        ctx.data = await model.users.updateUserByUserId(userId);
        await next();
      }
    ]
  )
}
