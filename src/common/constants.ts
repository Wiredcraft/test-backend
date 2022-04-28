// commonly used consts in this file
// includes: MHttpStatus, MHttpError

import { CustomError } from './customError';

export const ERRColor = '\x1B[31m%s\x1B[0m';

interface IHttpStatus {
  readonly SUCCESS_CODE: number,
  readonly SUCCESS_MSG: string,
  readonly ERROR_BAD_REQUEST_CODE: number,
  readonly ERROR_BAD_REQUEST_MSG: string,
  readonly ERROR_UNAUTHORIZED_CODE: number,
  readonly ERROR_UNAUTHORIZED_MSG: string,
  readonly ERROR_NOT_FOUND_CODE: number,
  readonly ERROR_NOT_FOUND_MSG: string,
  readonly ERROR_METHOD_NOT_ALLOWED_CODE: number,
  readonly ERROR_METHOD_NOT_ALLOWED_MSG: string,
  readonly ERROR_PARAMS_ERROR_CODE: number,
  readonly ERROR_PARAMS_ERROR_MSG: string,
  readonly ERROR_SERVER_ERROR_CODE: number,
  readonly ERROR_SERVER_ERROR_MSG: string,
  readonly ERROR_NOTIMPLEMENTED_CODE: number,
  readonly ERROR_NOTIMPLEMENTED_MSG: string,

  readonly ERROR_UNKNOW_ERROR_CODE: number,
  readonly ERROR_UNKNOW_ERROR_MSG: string,
  readonly ERROR_DATA_ALREADY_EXISTS_CODE: number,
  readonly ERROR_DATA_ALREADY_EXISTS_MSG: string,
  readonly ERROR_OPERATE_FIAL_CODE: number,
  readonly ERROR_OPERATE_FIAL_MSG: string,
}

export const MHttpStatus: IHttpStatus = {
  SUCCESS_CODE: 200,
  SUCCESS_MSG: 'success',
  ERROR_BAD_REQUEST_CODE: 400,
  ERROR_BAD_REQUEST_MSG: 'bad request',
  ERROR_UNAUTHORIZED_CODE: 401,
  ERROR_UNAUTHORIZED_MSG: 'unauthorized',
  ERROR_NOT_FOUND_CODE: 404,
  ERROR_NOT_FOUND_MSG: 'not found',
  ERROR_METHOD_NOT_ALLOWED_CODE: 405,
  ERROR_METHOD_NOT_ALLOWED_MSG: 'method is not allowed',
  ERROR_PARAMS_ERROR_CODE: 406,
  ERROR_PARAMS_ERROR_MSG: 'params is error',
  ERROR_SERVER_ERROR_CODE: 500,
  ERROR_SERVER_ERROR_MSG: 'server error',
  ERROR_NOTIMPLEMENTED_CODE: 501,
  ERROR_NOTIMPLEMENTED_MSG: 'method not implemented',

  ERROR_UNKNOW_ERROR_CODE: 10001,
  ERROR_UNKNOW_ERROR_MSG: 'unkow error',
  ERROR_DATA_ALREADY_EXISTS_CODE: 10002,
  ERROR_DATA_ALREADY_EXISTS_MSG: 'data is already exists',
  ERROR_OPERATE_FIAL_CODE: 10003,
  ERROR_OPERATE_FIAL_MSG: 'operate fail',
};

export class ErrorResult extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const MHttpCodes = Object.values(MHttpStatus).filter(item => typeof item === 'number');

const {
  ERROR_BAD_REQUEST_CODE, ERROR_BAD_REQUEST_MSG,
  ERROR_UNAUTHORIZED_CODE, ERROR_UNAUTHORIZED_MSG,
  ERROR_NOT_FOUND_CODE, ERROR_NOT_FOUND_MSG,
  ERROR_METHOD_NOT_ALLOWED_CODE, ERROR_METHOD_NOT_ALLOWED_MSG,
  ERROR_PARAMS_ERROR_CODE, ERROR_PARAMS_ERROR_MSG,
  ERROR_SERVER_ERROR_CODE, ERROR_SERVER_ERROR_MSG,
  ERROR_NOTIMPLEMENTED_CODE, ERROR_NOTIMPLEMENTED_MSG,
  ERROR_UNKNOW_ERROR_CODE, ERROR_UNKNOW_ERROR_MSG,
  ERROR_DATA_ALREADY_EXISTS_CODE, ERROR_DATA_ALREADY_EXISTS_MSG,
  ERROR_OPERATE_FIAL_CODE, ERROR_OPERATE_FIAL_MSG,
} = MHttpStatus;

const ERROR_BAD_REQUEST = (msg?: string, funName?: string, errorMsg?: string): CustomError => new CustomError(msg || 'ERROR_BAD_REQUEST', ERROR_BAD_REQUEST_CODE, `${funName || ''} ${errorMsg || ERROR_BAD_REQUEST_MSG}`);
const ERROR_UNAUTHORIZED = (msg?: string, funName?: string, errorMsg?: string): CustomError => new CustomError(msg || 'ERROR_UNAUTHORIZED', ERROR_UNAUTHORIZED_CODE, `${funName || ''} ${errorMsg || ERROR_UNAUTHORIZED_MSG}`);
const ERROR_NOT_FOUND = (msg?: string, funName?: string, errorMsg?: string): CustomError => new CustomError(msg || 'ERROR_NOT_FOUND', ERROR_NOT_FOUND_CODE, `${funName || ''} ${errorMsg || ERROR_NOT_FOUND_MSG}`);
const ERROR_METHOD_NOT_ALLOWED = (msg?: string, funName?: string, errorMsg?: string): CustomError => new CustomError(msg || 'ERROR_METHOD_NOT_ALLOWED', ERROR_METHOD_NOT_ALLOWED_CODE, `${funName || ''} ${errorMsg || ERROR_METHOD_NOT_ALLOWED_MSG}`);
const ERROR_PARAMS_ERROR = (msg?: string, funName?: string, errorMsg?: string): CustomError => new CustomError(msg || 'ERROR_PARAMS_ERROR', ERROR_PARAMS_ERROR_CODE, `${funName || ''} ${errorMsg || ERROR_PARAMS_ERROR_MSG}`);
const ERROR_SERVER_ERROR = (msg?: string, funName?: string): CustomError => new CustomError(msg || 'ERROR_SERVER_ERROR', ERROR_SERVER_ERROR_CODE, `${funName || ''} ${ERROR_SERVER_ERROR_MSG}`);
const ERROR_NOTIMPLEMENTED = (msg?: string, funName?: string): CustomError => new CustomError(msg || 'ERROR_NOTIMPLEMENTED', ERROR_NOTIMPLEMENTED_CODE, `${funName || ''} ${ERROR_NOTIMPLEMENTED_MSG}`);
const ERROR_UNKNOW_ERROR = (msg?: string, funName?: string): CustomError => new CustomError(msg || 'ERROR_UNKNOW_ERROR', ERROR_UNKNOW_ERROR_CODE, `${funName || ''} ${ERROR_UNKNOW_ERROR_MSG}`);
const ERROR_DATA_ALREADY_EXISTS = (msg?: string, funName?: string): CustomError => new CustomError(msg || 'ERROR_DATA_ALREADY_EXISTS', ERROR_DATA_ALREADY_EXISTS_CODE, `${funName || ''} ${ERROR_DATA_ALREADY_EXISTS_MSG}`);
const ERROR_OPERATE_FIAL = (msg?: string, funName?: string): CustomError => new CustomError(msg || 'ERROR_OPERATE_FIAL', ERROR_OPERATE_FIAL_CODE, `${funName || ''} ${ERROR_OPERATE_FIAL_MSG}`);


export const MHttpError = {
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_NOT_FOUND,
  ERROR_METHOD_NOT_ALLOWED,
  ERROR_PARAMS_ERROR,
  ERROR_NOTIMPLEMENTED,
  ERROR_SERVER_ERROR,
  ERROR_UNKNOW_ERROR,
  ERROR_DATA_ALREADY_EXISTS,
  ERROR_OPERATE_FIAL,
  400: ERROR_BAD_REQUEST,
  401: ERROR_UNAUTHORIZED,
  404: ERROR_NOT_FOUND,
  405: ERROR_METHOD_NOT_ALLOWED,
  406: ERROR_PARAMS_ERROR,
  500: ERROR_SERVER_ERROR,
  501: ERROR_NOTIMPLEMENTED,

  10001: ERROR_UNKNOW_ERROR,
  10002: ERROR_DATA_ALREADY_EXISTS,
  10003: ERROR_OPERATE_FIAL,

};
