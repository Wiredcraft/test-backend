/**
 * # Configuration File
 *
 * @public
 */
import type { DataSourceOptions } from 'typeorm';
import type { RedisOptions } from 'ioredis';
import type { opts as SessionOpts } from 'koa-session';
import { Options as BodyParserOpts } from 'koa-bodyparser';
import type { LoginRedirectConfig } from '../middleware/loginRedirect';
import { AuthConfig } from '../service/auth';

/**
 * This works too, but is more verbose
 * @enum
 */
export const port = 3000;

export const mongo: DataSourceOptions = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  username: 'root',
  password: '',
  database: 'test-backend'
};

export const redis: RedisOptions = {
  port: 6379
};

export const bodyParser: BodyParserOpts = {};

export const keys = ['some secret hurr'];

export const session: Partial<SessionOpts> = {
  key: 'test-backend:sess',
  maxAge: 86400000,
  secure: false /** (boolean) secure cookie*/
};

export const loginRedirect: LoginRedirectConfig = {
  signInPage: '/account/signin'
};

export const auth: AuthConfig = {
  requestTokenKey: 'x-auth-request-token',
  accessTokenKey: 'x-auth-access-token',
  saltKey: 'nice',
  callbackTTL: 1000 * 60 * 10, // 10 mins
  tokenTTL: 1000 * 60 * 60 * 24 * 3 // 3 days
};
