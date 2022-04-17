import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { useLogger } from './util/logger'

/**
 * @description Access log interceptor
 */
@Injectable()
export class AccessInterceptor implements NestInterceptor {
  protected readonly logger = useLogger('AccessInterceptor');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    this.logger.log(`Begin... ${req.method} ${req.url}`);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`After... ${req.method} ${req.url} ${Date.now() - now}ms`)),
      );
  }
}