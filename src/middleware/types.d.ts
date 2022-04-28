import { NPUsers } from '../services/types';

export declare namespace NPAuthentication {
  // local config
  interface ILocalConfigData {
    usernameField: string,// "name",
    passwordField: string,// "password"
  }
  // auth body config
  interface IAuthConfigData {
    audience: string,
    issuer: string,
    expiresIn: any,
    algorithm: any,
  }
  // auth config
  interface IauthenticationConfigData {
    secret: string,
    jwtOptions: IAuthConfigData,
    local: ILocalConfigData
  }
  // may use strategies
  type TAuthStrategies = 'local' | 'jwt';

  // strategy config
  interface IAuthStrategyObj {
    strategy:  TAuthStrategies
    auth: any
  }
  // surport auth strategies
  type TSurportAuthStrategies = {
    [key in TAuthStrategies]: IAuthStrategyObj
  }

  // auth obj, login success return to client
  interface IAuthData {
    id: string;
    token: string;
    expires: string;// token 过期时间
    strategy: string;// 认证策略 'local',
    user: NPUsers.IUser
  }
}