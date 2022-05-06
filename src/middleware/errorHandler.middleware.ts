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
      const { code, message }  = (ctx.body || {}) as any;
      const err = {
        code: code || ctx.status,
        message: ctx.message || message
      };
      returnError(ctx, err);
    }
  } catch (error) {
    const errorStr = JSON.stringify(error, null, ' ');
    if (errorStr.length < 5) {
      console.log(ERRColor, 'myErrorHandler error:', error);
    }
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
  // omit some fields
  err = omit(err, ['status', 'className', 'level', 'statusCode', 'expose']);
  delete ctx['__serviceName'];
  delete ctx['__serviceMethod'];
  // const code = err.code || status;
  const { code = status, message, errorCode, errorMsg, } = err;
  const info = {
    serviceName: __serviceName,
    serviceMethod: __serviceMethod,
    url,
    method,
    status,
    code,
    message,
    errorCode,
    errorMsg,
  };

  ctx.status = code;
  if ([404, 405].includes(code)) {
    ctx.logger.error(info);
    ctx.body = omit(code && (MHttpError as any)[`${code}`](__serviceName, __serviceMethod), ['className', 'level']);
    return;
  } else if (MHttpCodes.includes(code)) {
    ctx.body = err;
  } else {
    ctx.status = 500;
    ctx.body = omit(MHttpError.ERROR_UNKNOW_ERROR(__serviceName, __serviceMethod), ['className', 'level']);
    return;
  }
  ctx.body = err;
};
