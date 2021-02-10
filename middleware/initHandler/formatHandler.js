const { Error } = require('../../common');

/**
 * @typedef {import("../../common/types").Context} Context
 * @typedef {import("../../common/types").Middleware} Middleware
 */

/**
 * format api response
 *
 * @param {Context} ctx
 * @param {Middleware} next
 */
const formatHandler = async (ctx, next) => {
  try {
    await next();
    ctx.body = {
      errorCode: 0,
      data: ctx.data,
    }
  } catch (error) {
    ctx.logger.error(error);

    if (error instanceof Error.HttpError) {
      ctx.body = {
        errorCode: Number(`${Error.code.http}${error.statusCode}`),
        message: error.message,
      };
    } else if (error instanceof Error.MongoError) {
      ctx.body = {
        errorCode: Error.code.mongo,
        message: 'DB Operations fail, please check theserver logs',
      };
    } else {
      ctx.body = {
        errorCode: Number(`${Error.code.default}`),
        message: error.message,
      };
    }
  }
};

module.exports = formatHandler;
