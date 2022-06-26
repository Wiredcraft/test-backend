/**
 * # Application
 *
 * ## Summary
 * This is the entry of test-backend project.
 *
 * ## Sections
 *
 * 1. Load [middlewares](./middleware.html)
 * 2. Load [controllers](./controller.html)
 * 3. Host
 *
 * ### Load Middlewares
 *
 * When the Application starting, it will [load](../modules/util_web.html) all the globel middleares
 * in order defined in the middleware's [index](./middleware.html).
 *
 * ### Load Controllers
 *
 * After the global middlewares loaded, it will [load](../modules/util_web.html) all the controllers
 * which defined in the controller's [index](./controller.html).
 *
 * ### Host
 *
 * While all the middlewares and controllers loaded, env `NODE_ENV` will
 * be check if it's `'production'`.
 *
 * If we started from `'production'`, app will host on the port which
 * specified in configuration file (default located `src/config/config.default.ts`).
 *
 * Otherwise, just export app for test.
 *
 * @module Application
 *  */
import 'reflect-metadata';
import Koa from 'koa';
import { debuglog } from 'util';
import { ControllerClasses } from './controller';
import { MiddlewareClasses } from './middleware';
import { loadControllers, loadMiddlewares } from './util/web';
import { port } from './config/config.default';

const debug = debuglog('App');

export const app = new Koa();

loadMiddlewares(app, MiddlewareClasses);
loadControllers(app, ControllerClasses);

/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
  app.listen(port, () => {
    debug('started at', port);
  });
}
