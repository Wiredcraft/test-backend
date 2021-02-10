const _ = require('lodash');

const validate = require('../validation/user');

module.exports = (router) => {
  router.post('/users', validate.postUser, async (ctx) => {
    const options = {
      user: _.get(ctx, ['validation', 'body', 'user']),
    };
    ctx.data = 'ok';
  });

  router.get('/users/:userId', validate.getUser, async (ctx) => {
    const options = {
      userId: _.get(ctx, ['validation', 'params', 'userId']),
    }
    ctx.data = 'ok';
  });

  router.delete('/users/:userId', validate.deleteUser, async (ctx) => {
    const options = {
      userId: _.get(ctx, ['validation', 'params', 'userId']),

    }
  });

  router.put('/users/:userId', validate.putUser, async (ctx) => {
    const options = {
      userId: _.get(ctx, ['validation', 'params', 'userId']),
    }
  });
}
