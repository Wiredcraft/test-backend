import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  CustomError, ErrorFriendAlreadyExists,
  ErrorFriendNotFound,
  ErrorUserNotFound,
} from '../../utils/error.codes';

@Catch(CustomError)
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: CustomError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = exception.message;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      exception instanceof ErrorUserNotFound ||
      exception instanceof ErrorFriendNotFound
    ) {
      status = HttpStatus.NOT_FOUND;
    }
    if (
        exception instanceof ErrorFriendAlreadyExists
    ) {
      status = HttpStatus.CONFLICT;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
