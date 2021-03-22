// error code
export enum ErrorCode {
  // 没问题
  OK = 0,

  // 未知错误
  UNKNOWN = 1,

  // 头缺少数据
  HeaderLack = 2,

  // 无权限
  NoPermission = 3,

  // 参数错误
  ParamError = 4,

  // 资源不存在
  ResourceNotExist = 5,

  // 资源已存在
  ResourceExist = 5,

}

// 业务错误的实际值
export const ErrorMessage = {
  [ErrorCode.UNKNOWN]: '未知错误',
  [ErrorCode.HeaderLack]: 'Header 缺少数据',
  [ErrorCode.NoPermission]: '无权限, 请联系管理员',
  [ErrorCode.ParamError]: '参数错误',
  [ErrorCode.ResourceNotExist]: '{0} Resource {1} not exist',
  [ErrorCode.ResourceExist]: '{0} Resource {1} exist',
};
