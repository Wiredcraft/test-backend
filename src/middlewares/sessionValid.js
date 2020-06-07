import { decodeJwtToken } from "../lib/utils";
import { SessionModel } from "../models";

export default function() {
  return async (ctx, next) => {
    const authorization = ctx.header.authorization;
    if (!authorization) return next();
    const access_token = authorization.split(" ")[1];
    const sessionId = decodeJwtToken(access_token).session;
    const session = await SessionModel.get(sessionId);
    if (!session || session.deleted)
      throw ctx.throw(401, "Authentication Error");
    return next();
  };
}
