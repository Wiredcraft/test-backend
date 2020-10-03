import * as Koa from "koa";
import * as Router from "koa-router";
import * as LibUtil from "util";

import {Logger, LogInfo} from "../logger/Logger";
import * as UserController from "../controller/User";
import * as UserGeoController from "../controller/UserGeo";

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// ROUTER
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export const router = new Router();

// user
router.get("/user/:id", UserController.getUser);
router.post("/user", UserController.createUser);
router.put("/user", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);

// user geo
router.post("/usergeo", UserGeoController.saveUserGeo);
router.get("/usergeo/nearby/:id", UserGeoController.getNearbyUserIds);

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
