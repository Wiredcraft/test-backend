// customize error

import moment from 'moment';

export interface CustomErrorJSON {
  readonly name: string;
  readonly message: string;
  readonly code: number;
  readonly className: string;
  // readonly data?: any;
  readonly errors: any;
}

export class CustomError extends Error {
  readonly code: number | undefined;
  readonly message: string;
  readonly errorCode: number;
  readonly errorMsg: string | undefined;
  readonly className: string | Error;
  readonly errors: any;
  readonly timestamp: string;
  constructor(name: string | Error, code: number, message: string, errorCode: number, errorMsg?: string | Error) {
    super();
    this.code = code;
    this.message = message;
    // typeof name === 'string' && !name.includes('_') ? name : message;
    this.className = name;
    this.errorCode = errorCode;
    if (errorMsg) {
      if (errorMsg instanceof CustomError && errorMsg.hasOwnProperty('message')) {
        this.errorMsg = (errorMsg as Error).message;
        this.errors = errorMsg;
      } else {
        this.errorMsg = errorMsg as string || '';
      }
    }
    this.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  }
}