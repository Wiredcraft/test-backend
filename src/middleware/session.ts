/**
 * # Middleware: Session
 *
 * Using [koa-session](https://www.npmjs.com/package/koa-session) to handle session stuff.
 *
 * ## Midlleware Scope
 *
 * Global Registered.
 *
 * ## Midlleware Config
 *
 * - @Config('keys')
 * - @Config('session')
 * - Injected from `src/config/config.default`.
 *
 *
 * <br></br>
 * Check [index](../modules/middleware.html) for more middleware.
 *
 * @module
 */
import Koa from 'koa';
import session from 'koa-session';
import { Config, Provide } from '../util/container';
import { Middleware } from '../util/web';

@Provide()
export class Session {
  @Config('keys')
  keys: string[];

  @Config('session')
  config: session.opts;

  @Middleware()
  init(app: Koa) {
    app.keys = this.keys;
    return session(this.config, app);
  }
}
