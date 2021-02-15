const { v4: uuidv4 } = require('uuid');
const { logger } = require('../../lib');

/**
 * @typedef {import("../../common/types").Middleware} Middleware
 */

/**
 * context handler
 *
 * @param {object} context - koa context
 * @param {Middleware} next - koa next
 */
const contextHandler = async (context, next) => {
  context.seqId = uuidv4();
  context.logger = logger;

  await next();
}

module.exports = contextHandler;
