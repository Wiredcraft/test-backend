/**
 * @typedef {import("../../common/types").Context} Context
 * @typedef {import("../../common/types").Middleware} Middleware
 */

/**
 * log entry
 *
 * @param {Context} ctx
 * @param {Middleware} next
 */
const logHandler = async (ctx, next) => {
  const start = Date.now();
  const { method, url, request } = ctx;

  ctx.logger.info('request', {
    seqId: ctx.seqId,
    method,
    url,
    query: request.query,
    body: request.body,
    headers: request.headers,
    timestamp: start,
  });

  await next();

  ctx.logger.info('response', {
    seqId: ctx.seqId,
    method,
    url,
    totalElapsed: Date.now() - start,
  });
};

module.exports = logHandler;
