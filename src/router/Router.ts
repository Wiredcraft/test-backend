import * as Koa from "koa";
import * as Router from "koa-router";
import * as LibUtil from "util";

import {Logger, LogInfo} from "../logger/Logger";
import * as UserController from "../controller/User";

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// ROUTER
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export const router = new Router();

router.get("/user/:id", UserController.getUser);
router.post("/user", UserController.createUser);
router.put("/user", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// UTILITIES
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface Response<T> {
  code: number;
  data: T;
}

export const buildResponse = <T>(code: number, data: T) => {
  return {
    code,
    data,
  } as Response<T>;
};

export const responseNormal = (module: string, action: string, ctx: Koa.Context, data?: any) => {
  Logger.get().debug({
    app: "Server",
    module,
    action,
    data: LibUtil.inspect(data),
  } as LogInfo);

  ctx.body = buildResponse(200, data);
};

export const responseError = (module: string, action: string, ctx: Koa.Context, code: number, err: Error) => {
  Logger.get().error({
    app: "Server",
    module,
    action,
    data: LibUtil.inspect(err),
  } as LogInfo);

  ctx.body = buildResponse(code, err.message);
};
