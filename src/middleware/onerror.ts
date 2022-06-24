import Koa, { ParameterizedContext } from 'koa';
import { CodeError } from '../config/constant';
import { Provide } from '../util/container';
import { Middleware } from '../util/web';

@Provide()
export class OnError {
  @Middleware()
  init(): Koa.Middleware {
    return async (ctx, next) => {
      try {
        // Wrap all the process
        await next();
      } catch (err) {
        // Global catch error
        if (err instanceof CodeError) {
          this.produceCodeError(ctx, err);
        } else {
          throw err;
        }
      }
    };
  }

  produceCodeError(ctx: ParameterizedContext, err: CodeError) {
    if (err.location) {
      ctx.redirect(err.location);
    } else {
      ctx.body = err.message;
      ctx.status = err.statusCode;
    }
  }
}