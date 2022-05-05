import { Context } from 'koa';
import moment from 'moment';
import mongoose from 'mongoose';
import { ERRColor, MHttpStatus } from '../common/constants';
import { IPageNationArgs, IResponseData, IResultData, ITotalResultData } from '../types';
import { getPagenation } from '../utils/utils';

const { SUCCESS_CODE, SUCCESS_MSG } = MHttpStatus;

/**
 *  get pagenation data
 * @param model mongose model
 * @param queryObj query object
 * @param params
 * @param selectFields select field names object
 * @param orderObj sort object
 * @returns
 */
const getTotalRes = async (model: mongoose.Model<any>, queryObj: any, params: IPageNationArgs, selectFields?: any, orderObj?: any): Promise<ITotalResultData> => {
  // get total
  const total = await model.count(queryObj);
  const mSelectFields = selectFields || { __v: 0 };
  const mOrderObj = orderObj || { createdAt: -1 };
  const { limit, skip } = getPagenation(params);
  const orderPage = { sort: mOrderObj, limit, skip };
  // get data
  const data = await model.find(queryObj, mSelectFields, orderPage);
  const res: ITotalResultData = {
    total,
    limit,
    skip,
    data,
  };
  return res;
};

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

  ctx.returnTotal = async (model: mongoose.Model<any>, queryObj: any, params: IPageNationArgs, omitFields?: any, orderObj?: any) => {
    // get total
    const totalRes = await getTotalRes(model, queryObj, params, omitFields, orderObj);
    // console.log('48====>>', res);
    ctx.successResult(totalRes);
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