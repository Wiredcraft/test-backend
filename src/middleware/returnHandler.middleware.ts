import { Context } from 'koa';
import moment from 'moment';
import { ERRColor, MHttpStatus } from '../common/constants';
import { IResponseData, IResultData } from '../types';

const { SUCCESS_CODE, SUCCESS_MSG } = MHttpStatus;

/**
 * return handler middleware
 */
export  default async (ctx: Context, next: any) => {
  ctx.successResult = (res: any) => {
    const returnBody: IResultData = {
      code: SUCCESS_CODE,
      message: SUCCESS_MSG,
      data: res,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    // find data reponse format
    if (Object.prototype.toString.call(res) === '[object Object]' && res.hasOwnProperty('total') && res.hasOwnProperty('data')) {
      const { data, total, limit, skip } = res;
      returnBody.total = total;
      limit !== undefined && (returnBody.limit = limit);
      skip !== undefined && (returnBody.skip = skip);
      returnBody.data = data;
    }
    ctx.body = returnBody;
  };

  ctx.errorResult = (res: any) => {
    const { code, message } = res;
    const { url, method, __serviceName, __serviceMethod } = ctx;
    const status = ctx.status;
    const info = {
      serviceName: __serviceName,
      serviceMethod: __serviceMethod,
      url,
      method,
      status,
      code
    };
    console.log(ERRColor, 'errorResult error:', info);
    ctx.logger.error(info);
    const returnBody: IResponseData = {
      code,
      message,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    ctx.body = returnBody;
  };

  await next();
};