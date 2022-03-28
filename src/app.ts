import Koa from 'koa';
import KoaBodyParser from 'koa-bodyparser';

import { router } from './router';
import { errorHandler } from './lib/middleware/errorHandler';

export const app = new Koa();

// Use a custom middleware for the error handling
app.use(errorHandler);

app.use(KoaBodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.proxy = true;
