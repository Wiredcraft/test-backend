import Koa2 from "koa";
import body from "koa-body";
import compress from "koa-compress";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import koaLogger from "koa-logger";
import koaPinoLogger from "koa-pino-logger";
import jwt from "koa-jwt";
import Router from "koa-tree-router";
import { queryNormalizr } from "@36node/query-normalizr";

import logger from "./lib/log";
import { BASE, NODE_ENV, JWT_KEY } from "./config";
import { usersService, friendshipService, authService } from "./services";
import { sessionValid } from "./middlewares";

const app = new Koa2();
const router = new Router({ prefix: BASE });

/**
 * register services
 */
usersService.bind(router);
friendshipService.bind(router);
authService.bind(router);

/**
 * logger
 */
if (NODE_ENV !== "production") {
  // simple log under development
  app.use(koaLogger());
} else {
  app.use(koaPinoLogger({ logger }));
}

/**
 * application
 */
app
  .use(helmet())
  .use(cors({ exposeHeaders: ["Link", "X-Total-Count"] }))
  .use(
    jwt({ secret: JWT_KEY }).unless({
      path: [/\/auth\/github*/, /\/auth\/login/, /favicon.ico/],
    })
  )
  .use(body())
  .use(sessionValid())
  .use(queryNormalizr())
  .use(compress({ threshold: 2048 }))
  .use(router.routes());

usersService.createUser({ body: { name: "admin" } });

export default app;
