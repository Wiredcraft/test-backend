import Koa from 'koa';
import { Provide } from '../util/container';
import { Middleware } from '../util/web';

@Provide()
export class StatCostTime {
  @Middleware()
  init(): Koa.Middleware {
    return async (ctx, next) => {
      const started = Date.now();
      await next();
      ctx.set('x-time-cost', String(Date.now() - started));
    };
  }
}
