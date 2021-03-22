import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { randomBytes } from 'crypto';

export interface ITResponse<T> {
  // track id
  requestId: string;

  // data
  payload: T;

  // code
  code: 0;
}

export class ResponseInterceptor<T>
  implements NestInterceptor<T, ITResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ITResponse<T>> | Promise<Observable<ITResponse<T>>> {
    return next.handle().pipe(
      map((data: any) => {
        return {
          requestId:
            context.switchToHttp().getRequest().headers['requestId'] ??
            randomBytes(16).toString('hex'),
          payload: data,
          code: 0,
        };
      }),
    );
  }
}
