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
