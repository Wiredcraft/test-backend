/**
 * # Error Codes
 *
 * |ErrorCode | HttpStatusCode | Message
 * |-----     |---|----------|
 * |10000     |400|`invalid paramter: '${name}'`
 * |10001     |400|`paramter validation failed: xxx`
 * |11000     |400|`id should be a ObjectId`
 * |11001     |400|`email should be a string`
 * |11100     |400|`invalided email`
 * |11002     |404|`User not found`
 * |12000     |404|`Email not found`
 * |12001     |403|`invalid password`
 * |12002     |409|`Registered email conflict`
 * |12100     |409|`Duplicated follow action`
 * |12200     |428|`No location found, please update location first`
 * |12300     |404|`Auth client id not found, please register client first`
 * |12301     |404|`RequestToken is invalid or out of date`
 * |12302     |403|`Unexpected source of token`
 * |12303     |404|`AccessToken is invalid or out of date`
 * |1000      |423|`Too much request, please try again later`
 * |1001      |403|`No permission`
 * |1002      |500|`Interval server error`
 * |1003      |302|`Not authorized request, please sign in first`
 *
 * @module
 */
import assert from 'assert';
import { ValidationError } from 'class-validator';

interface CodeErrorOpts {
  errorCode: number;
  statusCode: number;
  message: string;
  location?: string;
}

export class CodeError extends Error {
  errorCode: number;
  statusCode: number;
  location?: string;

  constructor({ errorCode, statusCode, message, location }: CodeErrorOpts) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    if (location) {
      this.location = location;
    }
  }
}

export const ERROR = {
  ParameterError: (name: string) => {
    return new CodeError({
      errorCode: 10000,
      statusCode: 400,
      message: `invalid paramter: '${name}'`
    });
  },
  ParameterValidationError: (errors: ValidationError[]) => {
    let message = 'paramter validation failed:';
    for (const err of errors) {
      const constraints = err.constraints;
      assert(constraints);
      Object.keys(constraints).forEach((key) => {
        message += ' ' + constraints[key] + '.';
      });
    }
    return new CodeError({
      errorCode: 10001,
      statusCode: 400,
      message
    });
  },
  get MODEL_USER_GETONEBYID_PARAMS() {
    return new CodeError({
      errorCode: 11000,
      statusCode: 400,
      message: 'id should be a ObjectId'
    });
  },
  get MODEL_USER_GETONEBYEMAIL_PARAMS() {
    return new CodeError({
      errorCode: 11001,
      statusCode: 400,
      message: 'email should be a string'
    });
  },
  get ENTITY_USER_EMAIL() {
    return new CodeError({
      errorCode: 11100,
      statusCode: 400,
      message: 'invalided email'
    });
  },
  get MODEL_USER_GETONEBYID_USER_NOT_FOUND() {
    return new CodeError({
      errorCode: 11002,
      statusCode: 404,
      message: 'User not found'
    });
  },
  get SERVICE_ACCOUNT_SIGNIN_NOTFOUND_EMAIL() {
    return new CodeError({
      errorCode: 12000,
      statusCode: 404,
      message: 'Email not found'
    });
  },
  get SERVICE_ACCOUNT_SIGNIN_PASSWORD() {
    return new CodeError({
      errorCode: 12001,
      statusCode: 403,
      message: 'invalid password'
    });
  },
  get SERVICE_ACCOUNT_SIGNUP_EMAIL_CONFLICT() {
    return new CodeError({
      errorCode: 12002,
      statusCode: 409,
      message: 'Registered email conflict'
    });
  },
  get SERVICE_RELATION_FOLLOW_DUPLICATED() {
    return new CodeError({
      errorCode: 12100,
      statusCode: 409,
      message: 'Duplicated follow action'
    });
  },
  get SERVICE_USER_GETNEARBYLIST_LACK_LOCATION() {
    return new CodeError({
      errorCode: 12200,
      statusCode: 428,
      message: 'No location found, please update location first'
    });
  },
  get SERVICE_AUTH_COMMON_CLIENTID_NOT_FOUND() {
    return new CodeError({
      errorCode: 12300,
      statusCode: 404,
      message: 'Auth client id not found, please register client first'
    });
  },
  get SERVICE_AUTH_REQUESTTOKEN_CACHE_NOT_FOUND() {
    return new CodeError({
      errorCode: 12301,
      statusCode: 404,
      message: 'RequestToken is invalid or out of date'
    });
  },
  get SERVICE_AUTH_REQUESTTOKEN_UNEXPECTED_SOURCE() {
    return new CodeError({
      errorCode: 12302,
      statusCode: 403,
      message: 'Unexpected source of token'
    });
  },
  get SERVICE_AUTH_ACCESSTOKEN_NOT_FOUND() {
    return new CodeError({
      errorCode: 12303,
      statusCode: 404,
      message: 'AccessToken is invalid or out of date'
    });
  },
  get SERVICE_AUTH_ACESSTOKEN_INVALID() {
    return new CodeError({
      errorCode: 12304,
      statusCode: 403,
      message: 'Invalid AccessToken, please check clientId / permissions'
    });
  },
  get COMMON_CACHE_LOCK_LOCKED() {
    return new CodeError({
      errorCode: 1000,
      statusCode: 423,
      message: 'Too much request, please try again later'
    });
  },
  get COMMON_NO_PERMISSION() {
    return new CodeError({
      errorCode: 1001,
      statusCode: 403,
      message: 'No permission'
    });
  },
  get COMMON_INTERVAL_SERVER_ERROR() {
    return new CodeError({
      errorCode: 1002,
      statusCode: 500,
      message: 'Interval server error'
    });
  },
  COMMON_LOGIN_REDIRECT_ERROR(location: string) {
    return new CodeError({
      errorCode: 1003,
      statusCode: 302,
      location,
      message: 'Not authorized request, please sign in first'
    });
  }
};
