import { Context, Next } from 'koa';

import BaseService from '../lib/BaseService';
import { jwtAuth } from '../middleware/authHandler.middleware';
import LoginLog from '../models/loginLog';
import { getServiceMainUrl } from '../utils/utils';
import { NPLoginLog } from './types';

/**
 * to save user LoginLog Data
 * @param {NPLoginLog.ILoginLog} data
 * @returns NPLoginLog.ILoginLog
 */
export const saveLoginLogData = async (data: NPLoginLog.ILoginLog) => {
  const { userId, ip, userAgent } = data;
  const login = new LoginLog({ userId, ip, userAgent });
  const res = await login.save();
  return res;
};

class ServerLoginLog extends BaseService {
  /**
  * @api {get} /api/v1/serverLoginLog find User login log list by pagenation
  * @apiDescription api description
  * @apiName /api/v1/serverLoginLog restful:find
  * @apiGroup LoginLog
  * @apiVersion v1.0.0
  * @apiHeader {String} authorization user request token
  *
  * @apiParam {Context} ctx koa context, this param server call must be passed in
  * @apiParam {Next} next koa Next, this param server call must be passed in
  * @apiParam {String} userId? user id
  * @apiParam {String} ip? user login ip
  *
  * @apiSuccess {Number} code success code
  * @apiSuccess {String} message msg info
  * @apiSuccess {json} data user data
  * @apiError {Date} timestamp success respone time
  *
  * @apiError {Error} code error code
  * @apiError {Error} message error code
  * @apiError {Date} timestamp error respone time
  *
  * @apiSuccessExample {json} Success-Response:
  * {
      "code": 200,
      "message": "success",
      "data": [
        {
          "userId": "6269f7313c48c03e5c6e013d",
          "ip": "127.0.0.1",
          "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
          "createdAt": "2022-04-28T06:30:16.782Z",
          "updatedAt": "2022-04-28T06:30:16.782Z"
        }
      ],
      "timestamp": "2022-04-28 15:13:58",
      "total": 1,
      "limit": 10,
      "skip": 0
    }
  *
  * @apiErrorExample {json} Error-Response:
  * {
    "code": 401,
    "message": "unauthorized",
    "errorCode": 401,
    "errorMsg": "jwt unauthorized",
    "timestamp": "2022-04-27 19:28:29"
  }
  *
  */
  async find(ctx: Context, next: Next, params?: any): Promise<any> {
    const jwtAuthRes = await jwtAuth(ctx, next);
    if (!jwtAuthRes || !jwtAuthRes.id) {
      return;
    }
    // query objcet
    const queryObj: any = {};
    const { userId, ip, pageSize, pageIndex } = params;
    userId && (queryObj.userId = userId);
    ip && (queryObj.ip = ip);
    // pagenation args
    const mLimit = pageSize || 10;
    const mPageIndex = pageIndex > 0 ? pageIndex - 1 : 0;
    const mSkip = (mPageIndex || 0) * mLimit;
    // get total
    const total = await LoginLog.count(queryObj);
    // get data
    const data = await LoginLog.find(queryObj, { _id: 0, __v: 0 }, { sort: { createdAt: -1 }, limit: mLimit, skip: mSkip });
    const res = {
      total,
      limit: mLimit,
      skip: mSkip,
      data
    };
    ctx.successResult(res);
  }
}

export default (): ServerLoginLog => {
  // init serverLoginLog
  const serverLoginLog = new ServerLoginLog(LoginLog, 'ServerLoginLog', getServiceMainUrl('serverLoginLog'));
  return serverLoginLog;
};
