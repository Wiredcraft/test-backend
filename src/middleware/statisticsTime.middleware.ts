import { Context, Next } from 'koa';
import { get } from 'lodash';
import moment from 'moment';

/**
 *  statistics time middleware
 */
export default async (ctx: Context, next: Next) => {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  const { method, url, } = ctx.request;
  console.log(`response ${method} ${url} ${get(ctx, ['response', 'body','code'])}: ${ms}ms ${moment().format('YYYY-MM-DD HH:mm:ss')} ${ctx.callerIp || ''}`);
  ctx.response.set('X-Response-Time', `${ms}ms`);
};