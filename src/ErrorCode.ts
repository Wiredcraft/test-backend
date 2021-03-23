// error code
export enum ErrorCode {
  // OK
  OK = 0,

  // UNKNOWN
  UNKNOWN = 1,

  // HeaderLack
  HeaderLack = 2,

  // NoPermission
  NoPermission = 3,

  // ParamError
  ParamError = 4,

  // ResourceNotExist
  ResourceNotExist = 5,

  // ResourceExist
  ResourceExist = 5,

}

export const ErrorMessage = {
  [ErrorCode.UNKNOWN]: 'Unknown Error',
  [ErrorCode.HeaderLack]: 'Header lack',
  [ErrorCode.NoPermission]: 'no permission',
  [ErrorCode.ParamError]: 'bad params',
  [ErrorCode.ResourceNotExist]: '{0} Resource {1} not exist',
  [ErrorCode.ResourceExist]: '{0} Resource {1} exist',
};
