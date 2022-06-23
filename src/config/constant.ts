interface CodeErrorOpts {
  statusCode: number;
  message: string;
}

class CodeError extends Error {
  statusCode: number;

  constructor({ statusCode, message }: CodeErrorOpts) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const ERROR = {
  get MODEL_USER_GETONEBYID_PARAMS() {
    return new CodeError({
      statusCode: 400,
      message: 'User#getById(): id should be a ObjectId'
    });
  },
  get MODEL_USER_GETONEBYEMAIL_PARAMS() {
    return new CodeError({
      statusCode: 400,
      message: 'User#getOneByEmail(): email should be a string'
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
  get COMMON_CACHE_LOCK_LOCKED() {
    return new CodeError({
      statusCode: 423,
      message: 'Too much request, please try again later'
    });
  }
};
