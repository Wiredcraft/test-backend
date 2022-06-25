import { ValidationError } from 'class-validator';

interface CodeErrorOpts {
  statusCode: number;
  message: string;
  location?: string;
}

export class CodeError extends Error {
  statusCode: number;
  location?: string;

  constructor({ statusCode, message, location }: CodeErrorOpts) {
    super(message);
    this.statusCode = statusCode;
    if (location) {
      this.location = location;
    }
  }
}

export const ERROR = {
  ParameterError: (name: string) => {
    return new CodeError({
      statusCode: 400,
      message: `invalid paramter: '${name}'`
    });
  },
  ParameterValidationError: (errors: ValidationError[]) => {
    let message = 'paramter validation failed:';
    for (const err of errors) {
      const constraints = err.constraints;
      if (constraints === undefined) {
        continue;
      }
      Object.keys(constraints).forEach((key) => {
        message += ' ' + constraints[key] + '.';
      });
    }
    return new CodeError({
      statusCode: 400,
      message
    });
  },
  get MODEL_USER_GETONEBYID_PARAMS() {
    return new CodeError({
      statusCode: 400,
      message: 'id should be a ObjectId'
    });
  },
  get MODEL_USER_GETONEBYEMAIL_PARAMS() {
    return new CodeError({
      statusCode: 400,
      message: 'email should be a string'
    });
  },
  get ENTITY_USER_EMAIL() {
    return new CodeError({
      statusCode: 400,
      message: 'invalided email'
    });
  },
  get MODEL_USER_GETONEBYID_USER_NOT_FOUND() {
    return new CodeError({
      statusCode: 404,
      message: 'User not found'
    });
  },
  get SERVICE_ACCOUNT_SIGNIN_NOTFOUND_EMAIL() {
    return new CodeError({
      statusCode: 404,
      message: 'Email not found'
    });
  },
  get SERVICE_ACCOUNT_SIGNIN_PASSWORD() {
    return new CodeError({
      statusCode: 403,
      message: 'invalid password'
    });
  },
  get SERVICE_ACCOUNT_SIGNUP_EMAIL_CONFLICT() {
    return new CodeError({
      statusCode: 409,
      message: 'Registered email conflict'
    });
  },
  get SERVICE_RELATION_FOLLOW_DUPLICATED() {
    return new CodeError({
      statusCode: 409,
      message: 'Duplicated follow action'
    });
  },
  get SERVICE_USER_GETNEARBYLIST_LACK_LOCATION() {
    return new CodeError({
      statusCode: 428,
      message: 'No location found, please update location first'
    });
  },
  get SERVICE_AUTH_COMMON_CLIENTID_NOT_FOUND() {
    return new CodeError({
      statusCode: 404,
      message: 'Auth client id not found, please register client first'
    });
  },
  get SERVICE_AUTH_REQUESTTOKEN_CACHE_NOT_FOUND() {
    return new CodeError({
      statusCode: 404,
      message: 'RequestToken is invalid or out of date'
    });
  },
  get SERVICE_AUTH_REQUESTTOKEN_UNEXPECTED_SOURCE() {
    return new CodeError({
      statusCode: 403,
      message: 'Unexpected source of token'
    });
  },
  get SERVICE_AUTH_ACCESSTOKEN_NOT_FOUND() {
    return new CodeError({
      statusCode: 404,
      message: 'AccessToken is invalid or out of date'
    });
  },
  get COMMON_CACHE_LOCK_LOCKED() {
    return new CodeError({
      statusCode: 423,
      message: 'Too much request, please try again later'
    });
  },
  get COMMON_NO_PERMISSION() {
    return new CodeError({
      statusCode: 403,
      message: 'No permission'
    });
  },
  get COMMON_INTERVAL_SERVER_ERROR() {
    return new CodeError({
      statusCode: 500,
      message: 'Interval server error'
    });
  }
};
