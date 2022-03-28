import Koa from 'koa';
import { ERRORS } from '../../consts';
import { isTesting } from '../../config';
import { isNativeError } from 'util/types';

export async function errorHandler(ctx: Koa.Context, next: any): Promise<void> {
  try {
    await next();
  } catch (ex) {
    const clientError = isNativeError(ex) ? ERRORS.generic.server.error('', [], '') : ex;
    ctx.status = clientError.status || 500;
    if (!isTesting && clientError.status >= 500) {
      console.log(ex);
    }
    delete clientError.stack;
    delete clientError.status;
    ctx.body = clientError;
  }
}
