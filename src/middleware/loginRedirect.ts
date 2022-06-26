/**
 * # Middleware: LoginRedirectConfig
 *
 * To check if user signed in.
 *
 * ## Scope
 *
 * For local middleware introduced by @Guard.
 *
 * ## Config
 *
 * - @Config('loginRedirect')
 * - Injected from `src/config/config.default`.
 *
 *
 * <br></br>
 * Check [index](../modules/middleware.html) for more middleware.
 *
 * @module
 */
import assert from 'assert';
import Koa from 'koa';
import { ERROR } from '../config/constant';
import { Config, Provide } from '../util/container';
import { Middleware } from '../util/web';

export interface LoginRedirectConfig {
  signInPage: string;
}

@Provide()
export class LoginRedirect {
  @Config('loginRedirect')
  config: LoginRedirectConfig;

  @Middleware()
  init(): Koa.Middleware {
    return (ctx, next) => {
      const user = ctx.session?.user;
      assert(user, ERROR.COMMON_LOGIN_REDIRECT_ERROR(this.config.signInPage));
      return next();
    };
  }
}
