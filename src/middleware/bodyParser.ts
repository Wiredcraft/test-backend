/**
 * # Middleware: BodyParser
 *
 * Using [koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser) to parse the request body.
 *
 * ## Scope
 *
 * Global Registered.
 *
 * ## Config
 *
 * - @Config('bodyParser')
 * - Injected from `src/config/config.default`.
 *
 *
 * <br></br>
 * Check [index](../modules/middleware.html) for more middleware.
 *
 * @module
 */
import bodyParser from 'koa-bodyparser';
import { Config, Provide } from '../util/container';
import { Middleware } from '../util/web';

@Provide()
export class BodyParser {
  @Config('bodyParser')
  options: bodyParser.Options;

  @Middleware()
  init() {
    return bodyParser(this.options);
  }
}
