import Router from 'koa-router';
import glob from 'glob';
import path from 'path';
import Koa from 'koa';
import { isFunction } from 'lodash';

import { config } from './config';

export const router = new Router();

// This route serves as a health check. Should return the mongo db connection's status and other services' if any.
router.get('/ping', (ctx: Koa.Context) => {
  ctx.body = { status: 'OK' };
});

router.get('/', (ctx: Koa.Context) => {
  ctx.body = { name: config.appName, version: config.version };
});

const api = new Router();

// This relatively ugly code snippet looks through the v1 folder in /src/lib for all the router.ts files
// to look at all the routes. Pretty handy as it allows to just create a folder `toto` with a router.ts to load all
// its routes without extraneous configuration.
glob.sync('./v1/**/router.+(js|ts)', { cwd: `${__dirname}/lib` }).forEach((routerPath) => {
  // Disable @typescript-eslint/no-var-requires for code simplicity's sake
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const router = require(`./lib/${routerPath}`);
  if (!isFunction(router.router.routes)) return;

  const namespace = path
    .dirname(routerPath)
    .split(path.sep)
    .slice(2)
    .join(path.sep);

  api.use(`/v1/${namespace}`, router.router.routes());
});

router.use(api.routes());
