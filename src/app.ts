import Koa, { HttpError } from 'koa';
import koaBodyParser from 'koa-bodyparser';
import path from 'path';
import cors from '@koa/cors';
import KoaBody from 'koa-body';
import lo from 'lodash';
import KoaRouter from '@koa/router';
import koaStatic from 'koa-static';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const koaOnError = require('koa-onerror');

import config from './common/config';
import myMongoose from './db';
import servicesRouter from './services';
import logger from './utils/logger';
import { myErrorHandler } from './middleware/errorHandler.middleware';
import returnHandler from './middleware/returnHandler.middleware';
import authHandler from './middleware/authHandler.middleware';
import { getCallerIp, verifyData } from './utils/utils';
import statisticsTime from './middleware/statisticsTime.middleware';

// init Koa
const app = new Koa({ proxy: true });

// expand config to context
app.context.config = config;

// statistics time
app.use(statisticsTime);

// solving cross -domain request
app.use(cors());

// expand callerIp to context
app.use(async (ctx, next) => {
  const ip = getCallerIp(ctx.request);
  ctx.callerIp = ip;
  await next();
});

// development env take the api doc into  static resources
if (process.env.NODE_ENV === 'development') {
  app.context.__isDev = true;
  app.use(koaStatic(path.join(__dirname, '../doc/api')));
}

// load static resources
app.use(koaStatic(path.join(__dirname, '../public')));


// error handler
koaOnError(app);

// return handler
app.use(returnHandler);

// my error handler
app.use(myErrorHandler);

// expand myMongoose to context
app.context.myMongoose = myMongoose;

// expand logger to context
app.context.logger = logger;
// expand lodash to context
app.context.lo = lo;
// expand verifyData to context
app.context.verifyData = verifyData;

// support multipart
app.use(KoaBody({
  multipart: true,
}));

// add bodyparser
app.use(koaBodyParser());
app.use(koaBodyParser({
  enableTypes: ['json', 'form', 'text'],
  extendTypes: {
    text: ['text/xml', 'application/xml']
  }
}));

// const servicesRouter = services();
const authorizationUrl = '/authorization';
app.context.authorizationUrl = authorizationUrl;

// load the authorization
const koaRoute = new KoaRouter();
koaRoute.post(authorizationUrl, authHandler());
app.use(koaRoute.routes())
  .use(koaRoute.allowedMethods());

// load services
app.use(servicesRouter.routes())
  .use(servicesRouter.allowedMethods());


export default app;

