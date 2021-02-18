import { validationFail } from '../lib/errorMap';
import Koa from 'koa';
export function validator(fn: any) {
  async function v(ctx: Koa.Context, next: () => any) {
    const data = ctx.request.body;
    const error = fn(data);
    if (error) {
      ctx.body = validationFail();
      return;
    }
    await next();
  }
  return v;
}
