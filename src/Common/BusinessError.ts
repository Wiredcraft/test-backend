import { HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessage } from '../ErrorCode';

export interface ITError<T> {
  // request id
  requestId: string;

  // error code
  code: ErrorCode;

  // error message
  message: string;

  // error details
  details: T;
}

/**
 * BusinessError
 */
export default class BusinessError<T> implements ITError<T> {
  public code: ErrorCode = -1;
  public details = {} as T;
  public message = '';
  public requestId = '';
  public status = 200;

  public constructor(status: HttpStatus, code: ErrorCode);
  public constructor(status: HttpStatus, code: ErrorCode, args: any[]);
  public constructor(status: HttpStatus, code: ErrorCode, message: string);
  public constructor(
    status: HttpStatus,
    code: ErrorCode,
    message: string,
    args: any,
    detail: any,
  );
  public constructor(
    status: HttpStatus,
    code: any,
    message?: any,
    args?: any,
    details?: any,
  ) {
    this.code = code;
    this.status = status;
    if (!message) {
      return (this.message = ErrorMessage[code]);
    }

    if (Array.isArray(message)) {
      this.message = this.fillArgs(ErrorMessage[code], message);
      return;
    }

    if (Array.isArray(args)) {
      this.message = this.fillArgs(message, args);
    } else {
      this.message = message;
    }

    if (details) {
      this.details = details;
    }
  }

  /**
   * fill error message template
   * @param message
   * @param args
   */
  public fillArgs(message: string, args: any[]): string {
    return message.replace(
      /\{(.)\}/gi,
      (_, index_str) => args[parseInt(index_str)],
    );
  }

  public setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  /**
   * http status code
   */
  public getStatus() {
    return this.status;
  }

  /**
   * get error object
   */
  public toError() {
    return {
      code: this.code,
      details: process.env.NODE_ENV === 'prod' ? {} : this.details,
      requestId: this.requestId,
      message: this.message,
    };
  }
}
