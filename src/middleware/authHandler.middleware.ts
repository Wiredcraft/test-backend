import jsonwebtoken from 'jsonwebtoken';
import { Context, Next } from 'koa';
import lo from 'lodash';
import jwToken from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import moment from 'moment';

import { MHttpError } from '../common/constants';
import User from '../models/user';
import { NPAuthentication } from './types';
import config from '../common/config';
import { comparePwd } from '../utils/mcrypto';
import { saveLoginLogData } from '../services/LoginLog.service';

const { get, intersection, omit } = lo;

// import database config, priority use of the local environment
const authStrategiesEnv: string[] = config.get('Authentication.authStrategies') || [];

// allow not auth service
const serviceNotAuthControl = [
  // 'POST /api/v1/serverUser',
  ''
];

/**
 * get authObj through JWT
 * @param user user data
 * @param jwtOptions
 * @param secret jwt secret
 * @param defExpiresIn default expires time
 * @returns {NPAuthentication.IAuthData} authObj
 */
const getAuthObj = async (user: any, jwtOptions: NPAuthentication.IAuthConfigData, secret: any, defExpiresIn = '1h'): Promise<NPAuthentication.IAuthData> => {
  const { audience: aud, issuer: iss, expiresIn, algorithm } = jwtOptions;
  const expiresInNum = parseInt(expiresIn) || parseInt(defExpiresIn) || 1;
  const expiresInUnit = expiresIn.replace(/\d/g, '').toLowerCase()
    || defExpiresIn.replace(/\d/g, '').toLowerCase() || 'h';
  // format user data;
  const uid = user._id;
  user.id = uid;
  delete user._id;
  delete user.isDeteleted;
  // jwt sign token
  const token = jwToken.sign({
    aud,
    iss,
    sub: uid,
    jti: uuid()
  }, secret, { expiresIn, algorithm });
  // expires
  const expires = moment().add(expiresInNum, expiresInUnit).format('YYYY-MM-DD HH:mm:ss.SSS');
  return { id: uid, token, expires, strategy: 'local', user };
};

/**
 *  get user data by name
 * @param {Context} ctx koa Context
 * @param {string} name user name
 * @returns {NPUsers.IUser | null}
 */
const getUserByName = async (ctx: Context, name: string) => {
  const userData = await User.findOne({ name, isDeteleted: 'N' });
  return userData;
};

/**
 * get user data by token
 * @param {string} token
 * @param {string} secret jwt secret
 * @returns {NPUsers.IUser | null}
 */
const getUserByToken = async (token: string, secret: string) => {
  try {
    const decodeRes = jsonwebtoken.verify(token, secret);
    // JWT verification passes
    if (decodeRes && decodeRes.sub) {
      // the user is effective
      let user = await User.findOne({ id: decodeRes.sub, isDeteleted: 'N' });
      if (user) {
        user = user.toJSON();
        user.id = user._id;
        return omit(user, ['_id', 'password', '__v']);
      }
    }
  } catch (error) {
    console.log('getUserByToken error:', error);
  }
};
/**
 *  jwt authorization
 * @param {Context} ctx koa Context
 * @param {Next} next
 */
export const jwtAuth = async (ctx: Context, next: Next) => {
  const body = get(ctx, ['request', 'body']);
  const { authorization } = body || {};
  const mAuthorization = ctx.headers.authorization || authorization;
  // don't give authorization throw error;
  if (!!!mAuthorization) {
    ctx.errorResult(MHttpError.ERROR_UNAUTHORIZED());
  } else {
    const { Authentication: { secret } } = ctx.config;
    const authenticationSecret = process.env['AUTHENTICATION_SECRET'] || secret;
    const user = await getUserByToken(mAuthorization, authenticationSecret);
    if (user && user.id) {
      mountCurrentUser(ctx, user);
      ctx.successResult(user);
      await next();
      return user;
    } else {
      ctx.errorResult(MHttpError.ERROR_UNAUTHORIZED('jwt unauthorized'));
    }
  }
};

/**
 * mount user data to context,
 * @param {Context} ctx koa Context
 * @param {any} user user data
 */
const mountCurrentUser = (ctx: Context, user: any) => {
  ctx.currentUser = user;
};

/**
  * @api {post} /authorization create auth
  * @apiDescription create authObj includes token and user data
  * @apiName authorization restful:create
  * @apiGroup Authorization
  * @apiVersion v1.0.0
  *
  * @apiParam {Context} ctx koa context, this param server call must be passed in
  * @apiParam {Next} next koa Next, this param server call must be passed in
  * @apiParam {String} name user name
  * @apiParam {String} password user password
  * @apiParam {String} strategy 'local', Only only currently supports 'local', follow -up can be extended
  *
  * @apiSuccess {Number} code success code
  * @apiSuccess {String} message msg info
  * @apiSuccess {json} data user data
  * @apiError {Date} timestamp success respone time
  *
  * @apiError {Error} code error code
  * @apiError {Error} message error code
  * @apiError {Date} timestamp error respone time
  *
  * @apiSuccessExample {json} Success-Response:
  * {
      "code": 200,
      "message": "success",
      "data": {
        "id": "6267f5260e655d3f1f29b189",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL3lvdXJkb21haW4uY29tIiwiaXNzIjoiZG9tYWluIiwic3ViIjoiNjI2N2Y1MjYwZTY1NWQzZjFmMjliMTg5IiwianRpIjoiOGJhZDRiNTItMGIwYS00ZWM0LWFhZjctNWRkZGFlOWQzN2NhIiwiaWF0IjoxNjUxMDMwMjg1LCJleHAiOjE2NTExMTY2ODV9.dVcjAh-hUv63hN999aD4fhyhNX6DXFiYEz09Z2_JYfU",
        "expires": "2022-04-28 11:31:25.612",
        "strategy": "local",
        "user": {
          "name": "test07",
          "dob": "1998-05-12T00:00:00.000Z",
          "address": "shanghai",
          "description": "good man9",
          "createdAt": "2022-04-26T13:35:34.134Z",
          "updatedAt": "2022-04-26T13:35:34.138Z",
          "id": "6267f5260e655d3f1f29b189"
        }
      },
      "returnDate": "2022-04-27 19:51:25"
  * }
  *
  * @apiErrorExample {json} Error-Response:
  * {
      "code": 401,
      "message": " unauthorized",
      "timestamp": "2022-04-27 09:28:29"
    }
    {
      "code": 401,
      "message": "no strategy",
      "timestamp": "2022-04-27 09:53:15"
    }
    {
      "code": 401,
      "message": "loc is not supported!",
      "timestamp": "2022-04-27 09:58:38"
    }

    {
      "code": 401,
      "message": "not user",
      "timestamp": "2022-04-27 10:17:45"
    }
    {
      "code": 404,
      "message": " not found"
    }
    {
      "code": 405,
      "message": " method is not allowed",
      "timestamp": "2022-04-25 20:51:44"
    }
    {
      "code": 406,
      "message": "arg `name` is required",
      "timestamp": "2022-04-26 20:51:44"
    }
    {
      "code": 500,
      "message": " server error",
      "timestamp": "2022-04-26 18:06:48"
    }
  *
  */
const localAuth = async (ctx: Context, next: Next) => {
  const body = ctx.lo.get(ctx, ['request', 'body']);
  const { Authentication: { secret, jwtOptions, local: { usernameField, passwordField } } } = ctx.config;
  const mSecret = process.env['AUTHENTICATION_SECRET'] || secret;

  // obtain userName and userPassword through local strategy config
  const userName = get(body, usernameField);
  const userPassword = get(body, passwordField);
  // no user data return noauthorization error
  if (!userName || !userPassword) {
    ctx.errorResult(MHttpError.ERROR_UNAUTHORIZED('username or password is invalid'));
  } else {
    const userData = await getUserByName(ctx, userName);
    if (!userData) {
      ctx.errorResult(MHttpError.ERROR_UNAUTHORIZED('not user'));
    } else {
      const { password: hashPwd } = userData;
      // compared with password verification passing, tokens are issued
      const comparePwdRes = await comparePwd(userPassword, hashPwd);
      if (!comparePwdRes) {
        // password error
        ctx.errorResult(MHttpError.ERROR_UNAUTHORIZED('username or password is invalid'));
      } else {
        // proposal sensitive and useless information
        const nUserData = omit(userData.toJSON(), ['password', '__v']);
        const authObj: NPAuthentication.IAuthData = await getAuthObj(nUserData, jwtOptions, mSecret);
        // if the ID is not obtained, the ID is a service error
        if (!authObj.id) {
          ctx.errorResult(MHttpError.ERROR_UNAUTHORIZED('server error'));
          // return;
        }
        // mount user data to context, convenience to know current user
        mountCurrentUser(ctx, authObj.user);
        // to save user login data
        try {
          await saveLoginLogData({ userId: authObj.id, ip: ctx.callerIp, userAgent: ctx.headers['user-agent'] || ''});
        } catch (error) {}
        // console.log('authObj===>>>', authObj);
        ctx.successResult(authObj);
      }
    }
  }

};

// support strategy config
const mSurportAuthStrategies: NPAuthentication.TSurportAuthStrategies = {
  local: {
    strategy: 'local',
    auth: localAuth,
  },
  jwt: {
    strategy: 'jwt',
    auth: jwtAuth,
  },
};

// take the intersection of support auth strategies and enable auth strategies
const mStrategies = intersection(Object.keys(mSurportAuthStrategies), authStrategiesEnv);

/**
 *  strategy handler
 * @param {Context} ctx koa Context
 * @param {Next} next
 * @param {string} strategy local | jwt
 */
const strategyHandler = async (ctx: Context, next: Next, strategy: string) => {
  if (mStrategies.includes(strategy)) {
    await mSurportAuthStrategies[(strategy as NPAuthentication.TAuthStrategies)].auth(ctx, next);
  } else if (!strategy) {
    ctx.errorResult(MHttpError.ERROR_UNAUTHORIZED('no strategy'));
  } else {
    ctx.errorResult(MHttpError.ERROR_UNAUTHORIZED(`${strategy} is not supported!`));
  }
};

/**
 * auth handler
 * @param {string} specifyStrategy
 * @returns {NPAuthentication.IAuthData | CustomError}
 */
const authHandler = (specifyStrategy?: string) =>
  async (ctx: Context, next: Next) => {
    const { method, url, body } = ctx.request;
    // skip auth
    if (serviceNotAuthControl.includes(`${method.toUpperCase()} ${url}`)) {
      await next();
    } else {
    // server specify strategy, service to authorization
      if (specifyStrategy) {
        await strategyHandler(ctx, next, specifyStrategy);
      } else if (ctx.authorizationUrl !== url) {// url is not a valid
        ctx.errorResult(MHttpError.ERROR_NOT_FOUND());
      } else {// client request common authorization
        const { strategy } = body || {};
        await strategyHandler(ctx, next, strategy);
      }
    }
  };

export default authHandler;
