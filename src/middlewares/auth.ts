import Koa from 'koa';
import {authGuardFail} from '../lib/errorMap';
export async function authGuard(ctx: Koa.Context, next: () => any) {
  if (ctx.session && ctx.session.user) {
    await next();
    return;
  }
  ctx.body = authGuardFail();
} 