import * as LibPath from "path";

import * as Koa from "koa";
import * as swaggerJSDoc from "swagger-jsdoc";
import {SwaggerDefinition} from "swagger-jsdoc";
import {koaSwagger} from "koa2-swagger-ui";
import * as bodyParser from "koa-bodyparser";
import * as cors from "@koa/cors";

import {Config} from "../config/Config";
import {Redis} from "../database/Redis";
import {Logger, LogInfo} from "../logger/Logger";
import {router} from "../router/Router";

export const startServer = async () => {
  // initialize utilities
  Config.get("");
  Redis.get();
  Logger.get();

  const app = new Koa();
  const host = Config.get("WEB_HOST", "127.0.0.1");
  const port = parseInt(Config.get("WEB_PORT", "8081"));

  const swaggerHost = host;
  const swaggerPort = port;
  const apiVersion = `v0.0.1`;
  const apiBaseUrl = `/api/${apiVersion}`;

  // generate swagger definition & create endpoint "/swagger" to display it
  let swaggerSpec = {};
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore
    swaggerSpec = swaggerJSDoc({
      apis: [
        LibPath.join(__dirname, "controller/**/*.js"),
        LibPath.join(__dirname, "router/**/*.js"),
        LibPath.join(__dirname, "model/**/*.js"),
      ],
      explorer: true,
      swaggerDefinition: {
        basePath: apiBaseUrl,
        host: `${swaggerHost}:${swaggerPort}`,
        info: {
          description: "Wiredcraft Backend Test",
          title: "Wiredcraft Backend Test",
          version: apiVersion,
        },
      } as SwaggerDefinition,
    });
    app.use(
      // @ts-ignore
      koaSwagger({
        routePrefix: "/swagger",
        swaggerOptions: {
          spec: swaggerSpec,
        },
      }),
    );
  }

  // time consuming
  app.use(async (ctx: Koa.Context, next: Koa.Next) => {
    await next();
    const rt = ctx.response.get("X-Response-Time");
    const code = ctx.response.status;
    Logger.get().info({
      app: "Server", module: "Koa", action: "middleware",
      data: `${ctx.method} ${ctx.url} - ${code} - ${rt}`,
    } as LogInfo);
  });
  app.use(async (ctx: Koa.Context, next: Koa.Next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
  });

  // swagger download endpoints
  app.use(async (ctx: Koa.Context, next: Koa.Next) => {
    if (process.env.NODE_ENV !== "production" && ctx.path === "/swagger.json") {
      // production env, enabled
      ctx.status = 200;
      ctx.set("Content-Disposition", "attachment; filename=swagger.json");
      ctx.body = JSON.stringify(swaggerSpec, null, 4);
    } else if (ctx.path === "/swagger.json") {
      // non production env, empty json file
      ctx.status = 200;
      ctx.set("Content-Disposition", "attachment; filename=swagger.json");
      ctx.body = "{}";
    }
    return next();
  });

  // allow cors
  app.use(cors());

  // body parsing
  app.use(bodyParser());

  // apis
  router.prefix(apiBaseUrl);
  app.use(router.routes());

  console.log(`Server started, listening: ${host}:${port}`);
  return app.listen(port, host);
};
