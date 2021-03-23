import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ErrorCode, ErrorMessage } from './ErrorCode';
import { ValidationError } from 'joi';
import BusinessError from './Common/BusinessError';

@Catch()
export class ErrorCatchFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let error: BusinessError<any>;

    if (exception instanceof BusinessError) {
      error = exception;
    } else if (exception instanceof BadRequestException) {
      error = new BusinessError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.ParamError,
        ErrorMessage[ErrorCode.ParamError],
        [],
        exception,
      );
    } else if (exception instanceof ValidationError) {
      error = new BusinessError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.ParamError,
        ErrorMessage[ErrorCode.ParamError],
        [],
        exception,
      );
    } else {
      error = new BusinessError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN,
        exception.message,
        [],
        exception,
      );
    }

    error.setRequestId(request.headers['requestId']);
    (response as any).status(error.getStatus()).json(error.toError());
  }
}
