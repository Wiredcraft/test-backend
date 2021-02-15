/**
 * @typedef {import("../../common/types").Context} Context
 * @typedef {import("../../common/types").Middleware} Middleware
 */

/**
 * log entry
 *
 * @param {Context} ctx - ctx
 * @param {Middleware} next - next
 */
const logHandler = async (ctx, next) => {
  const start = Date.now();
  const { method, url, request } = ctx;

  ctx.logger.info(`request:: ${JSON.stringify({
    seqId: ctx.seqId,
    method,
    url,
    query: request.query,
    body: request.body,
    params: request.params,
    headers: request.headers,
  })}`);

  await next();

  ctx.logger.info(`response:: ${JSON.stringify({
    seqId: ctx.seqId,
    method,
    url,
    data: ctx.data,
    totalElapsed: Date.now() - start
  })}`);
};

module.exports = logHandler;
