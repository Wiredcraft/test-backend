const _ = require('lodash');
const model = require('../model');

exports.createUser = async (ctx, next) => {
  const options = {
    name: _.get(ctx, 'validation.body.name'),
    dob: _.get(ctx, 'validation.body.dob'),
    address: _.get(ctx, 'validation.body.address'),
    description: _.get(ctx, 'validation.body.description'),
  };

  ctx.data = await model.users.insertUser(options);
  await next();
};

exports.getUser = async (ctx, next) => {
  const userId = _.get(ctx, 'validation.params.userId');

  ctx.data = await model.users.findUserByUserId(userId) || {};
  await next();
};

exports.deleteUser = async (ctx, next) => {
  const userId = _.get(ctx, 'validation.params.userId');

  const affectRowsCount = await model.users.deleteUserByUserId(userId);
  ctx.data = {
    affectRowsCount
  };
  await next();
};

exports.updateUser = async (ctx, next) => {
  const userId = _.get(ctx, 'validation.params.userId');
  const options = {
    name: _.get(ctx, 'validation.body.name'),
    dob: _.get(ctx, 'validation.body.dob'),
    address: _.get(ctx, 'validation.body.address'),
    description: _.get(ctx, 'validation.body.description'),
  };

  const affectRowsCount = await model.users.updateUserByUserId(userId, options);
  ctx.data = {
    affectRowsCount
  };
  await next();
};
