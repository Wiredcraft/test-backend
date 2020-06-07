// import fs from "fs";
// import path from "path";

import Koa2 from "koa";
import body from "koa-body";
import compress from "koa-compress";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import koaLogger from "koa-logger";
import koaPinoLogger from "koa-pino-logger";
import jwt from "koa-jwt";
import Router from "koa-tree-router";
// import { queryNormalizr } from "@36node/query-normalizr";
// import health from "@36node/koa-health";
// import openapi from "@36node/koa-openapi";

import logger from "./lib/log";
import { BASE, NODE_ENV, JWT_KEY } from "./config";
import { usersService, friendshipService, authService } from "./services";
// import pkg from "../package.json";
import { someMid } from "./middlewares";

const app = new Koa2();
const router = new Router({ prefix: BASE });
// const publicKey = fs.readFileSync(path.join(__dirname, "../ssl/rsa_jwt.pub"));
// const openapiFile = fs.readFileSync(path.join(__dirname, "../openapi.yml"));

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
  // .use(health({ url: `${BASE}/health`, version: pkg.version }))
  // .use(openapi({ url: `${BASE}/openapi.yml`, file: openapiFile }))
  .use(jwt({ secret: JWT_KEY }).unless({ path: [/\/auth*/, /\/favicon.ico/] }))
  .use(body())
  .use(someMid())
  // .use(queryNormalizr())
  .use(compress({ threshold: 2048 }))
  .use(router.routes());

usersService.createUser({ body: { name: "admin" } });

export default app;
