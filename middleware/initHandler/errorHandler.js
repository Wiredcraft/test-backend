/**
 * @typedef {import("../../common/types").Context} Context
 * @typedef {import("../../common/types").Middleware} Middleware
 */

/**
 * only handler some exceptions, API error will be catched by formatHandler
 *
 * @param {Context} ctx
 * @param {Middleware} next
 */
const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.logger.error(error);
    ctx.status = 500;
  }
}

module.exports = errorHandler;
