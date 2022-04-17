import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { useLogger } from './util/logger'

/**
 * @description Global exception filter
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  protected readonly logger = useLogger(this);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse();
    this.logger.warn({
      path: request.url,
      error: exception
    })
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: error
      });
  }
}