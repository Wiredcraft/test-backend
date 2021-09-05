import path from "path";
import fs from "fs-extra";
import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { appLogger, catchError, timeout } from "./middleware";
import routes from "./routes";
import db from "./db";
import { redisInit } from "./db/redis";

const app = new Koa();
const router = new Router();

// dbinit();
db.init();
redisInit();

app.proxy = true;

app.use(appLogger);
app.use(catchError);

app.use(timeout);
app.use(cors());
app.use(bodyParser());

// 加载路由
router.use(routes.routes(), routes.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());
export { app };
