import { Context, Next } from 'koa';
import lo from 'lodash';
import { ERRColor, MHttpCodes, MHttpError, MHttpStatus } from '../common/constants';

const { omit, get } = lo;

/**
 * handler error middleware
 * @param {Context} ctx koa Context
 * @param {Next} next koa Next
 */
export const myErrorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
    if (ctx.status !== 200) {
      returnError(ctx, ctx.status);
    }
  } catch (error) {
    const errorStr = JSON.stringify(error, null, ' ');
    if (errorStr.length < 5) {
      console.log(ERRColor, 'myErrorHandler error:', error);
    }
    console.log(ERRColor, 'myErrorHandler error:', errorStr);
    // parts of mongose error handler
    if ((error as any).name === 'CastError' && (error as any).message.includes('Cast to ObjectId failed') ) {
      (error as any)._code = MHttpStatus.ERROR_PARAMS_ERROR_CODE;
      ctx.logger.error(error);
      error = MHttpError.ERROR_PARAMS_ERROR();
    } else {
      ctx.logger.error(error);
    }
    returnError(ctx, error);
  }
};


/**
 * save log and return Error info
 * @param {Context} ctx koa Context
 * @param {number} status reponse code
 */
const returnError = (ctx: Context, err: any) => {
  const { url, method, __serviceName, __serviceMethod } = ctx;
  const status = ctx.status;
  if (get(err, 'className')) {
    err = omit(err, ['className', 'level']);
  }
  delete ctx['__serviceName'];
  delete ctx['__serviceMethod'];
  const code = err.code || status;
  const info = {
    serviceName: __serviceName,
    serviceMethod: __serviceMethod,
    url,
    method,
    status,
    code
  };
  console.log(ERRColor, 'returnError error1:', info);

  // to save not allowed request data
  if ([404, 405].includes(code)) {
    ctx.logger.error(info);
    ctx.body = omit(code && (MHttpError as any)[`${code}`](__serviceName, __serviceMethod), ['className', 'level']);
  } else if (MHttpCodes.includes(code)) {
    ctx.body = err;
  } else if (!__serviceName || !__serviceMethod){
    ctx.body = MHttpError.ERROR_NOT_FOUND(__serviceName, __serviceMethod);
  } else {
    ctx.body = MHttpError.ERROR_UNKNOW_ERROR(__serviceName, __serviceMethod);
  }
};
