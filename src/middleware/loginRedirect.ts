/**
 * # Middleware: LoginRedirectConfig
 *
 * To check if user signed in.
 *
 * ## Midlleware Scope
 *
 * For local middleware introduced by @Guard.
 *
 * ## Middleware Config
 *
 * - @Config('loginRedirect')
 * - Injected from `src/config/config.default`.
 *
 * ## Usage Example
 *
 * ```
 * @Provide()
 * @Controller('/user')
 * export class UserController {
 *   // ...
 *
 *   // DELETE /user/:id
 *   @Guard(LoginRedirect) // <------ Decorated here
 *   @Delete('/:id')
 *   async delete(ctx: Context) {
 *     // 1. Check permission
 *     // ...
 *
 *     // 2. Delete
 *     // ...
 *   }
 * }
 * ```
 *
 * ## Used by
 *
 * | Method | Path                  | Link
 * |--------|-----------------------|--------------------------
 * | POST   | /auth/authorizate     | [Doc](../classes/controller_auth.AuthController.html#authorizate)
 * | POST   | /auth/token           | [Doc](../classes/controller_auth.AuthController.html#accessToken)
 * | GET    | /user/nearby          | [Doc](../classes/controller_user.UserController.html#getNearbyList)
 * | PATCH  | /user/:id             | [Doc](../classes/controller_user.UserController.html#update)
 * | DELETE | /user/:id             | [Doc](../classes/controller_user.UserController.html#delete)
 * | POST   | /user/relation/follow | [Doc](../classes/controller_user.UserController.html#follow)
 * | DELETE | /user/relation/follow | [Doc](../classes/controller_user.UserController.html#unfollow)
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
