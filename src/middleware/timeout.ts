import Koa = require("koa");
import config from "@/config";
import { HttpError, HttpStatusCode } from "@/helpers";

/**
 * 捕捉超时
 *
 * @author CaoMeiYouRen
 * @date 2020-05-25
 * @export
 * @param {Koa.Context} ctx
 * @param {Koa.Next} next
 */
export async function timeout(ctx: Koa.Context, next: Koa.Next) {
    let t: any = 0;
    const time = config.TIMEOUT_MAX_AGE; // 设置超时时间
    await Promise.race([
        new Promise((resolve, reject) => {
            t = setTimeout(() => {
                reject(
                    new HttpError(HttpStatusCode.REQUEST_TIMEOUT, "请求超时")
                );
            }, time);
        }),
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve, reject) => {
            // 使用一个闭包来执行下面的中间件
            try {
                await next();
                clearTimeout(t);
                resolve(true);
            } catch (e) {
                clearTimeout(t);
                reject(e);
            }
        }),
    ]);
}
