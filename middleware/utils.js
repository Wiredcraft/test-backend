const _ = require('lodash');

module.exports.getValueFromBody = (ctx, key) => _.get(ctx, ['validation', 'body', key]);

module.exports.getValueFromParams = (ctx, key) => _.get(ctx, ['validation', 'params', key]);
