import {
    chanceGuid
} from "../util/helper";
import applog from './applog'

export default function () {
    return async function (ctx, next) {
        let user = {}

        if (!ctx.header['x-trace-id']) {
            ctx.header['x-trace-id'] = chanceGuid()
        }
        ctx.header['x-span-id'] = chanceGuid();
        ctx.ccData = {
            startTimestamp: new Date().getTime(),
            user: user
        }
        applog.info(ctx, "autolog request")
        await next();
        applog.info(ctx, "autolog response")

    }
}