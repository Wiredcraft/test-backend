import { decodeJwtToken } from "../lib/utils";
import { SessionModel } from "../models";

export default function() {
  return async (ctx, next) => {
    const authorization = ctx.header.authorization;
    if (!authorization) return next();
    const accessToken = authorization.split(" ")[1];
    const sessionId = decodeJwtToken(accessToken).session;
    const session = await SessionModel.get(sessionId);
    if (!session || session.deleted) {
      throw ctx.throw(401, "Authentication Error");
    }
    return next();
  };
}
