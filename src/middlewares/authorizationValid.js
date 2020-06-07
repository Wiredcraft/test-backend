import { decodeJwtToken } from "../lib/utils";
import { UserModel } from "../models";

export default function() {
  return async (ctx, next) => {
    const authorization = ctx.header.authorization;
    if (!authorization) return next();
    const access_token = authorization.split(" ")[1];
    const accessTokenInfo = decodeJwtToken(access_token);
    const userId = accessTokenInfo.user;
    const user = await UserModel.get(userId);
    // TODO Authorization content
    return next();
  };
}
