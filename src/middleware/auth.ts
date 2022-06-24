import assert from 'assert';
import Koa from 'koa';
import { CodeError } from '../config/constant';
import { Config, Provide } from '../util/container';
import { Middleware } from '../util/web';

export interface AuthConfig {
  signInPage: string;
}

@Provide()
export class Auth {
  @Config('auth')
  config: AuthConfig;

  @Middleware()
  init(): Koa.Middleware {
    return (ctx, next) => {
      const user = ctx.session?.user;
      assert(
        user,
        new CodeError({
          statusCode: 302,
          location: this.config.signInPage,
          message: 'Not authorized request, please sign in first'
        })
      );
      return next();
    };
  }
}
