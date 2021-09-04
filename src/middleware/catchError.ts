import Koa = require("koa");
import { HttpError, HttpStatusCode, ResponseDto } from "@/helpers";
import config from "@/config";
import { Log } from "@/utils";
import { errorLogger } from "./logger";
export async function catchError(ctx: Koa.Context, next: Koa.Next) {
    try {
        await next();
    } catch (e) {
        let message: string | undefined = "Unknown Error";
        let statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        let stack: string | undefined;
        if (e instanceof HttpError) {
            message = e.message;
            statusCode = e.statusCode;
        } else if (e instanceof Error) {
            message = e.message;
            // 开发阶段打印堆栈信息
            if (config.IS_DEBUG) {
                stack = e.stack;
            }
        } else if (typeof e === "string") {
            message = e;
        }
        if (statusCode >= HttpStatusCode.INTERNAL_SERVER_ERROR) {
            Log.error(e);
            errorLogger.error(e);
        } else {
            Log.log(message);
        }
        ctx.status = statusCode;
        ctx.body = new ResponseDto({
            statusCode,
            message,
            stack,
        });
    }
}
