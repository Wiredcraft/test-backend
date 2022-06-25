import type { DataSourceOptions } from 'typeorm';
import type { opts as SessionOpts } from 'koa-session';
import { Options as BodyParserOpts } from 'koa-bodyparser';
import type { LoginRedirectConfig } from '../middleware/loginRedirect';
import { AuthConfig } from '../service/auth';

export const mongo: DataSourceOptions = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  username: 'root',
  password: '',
  database: 'test-backend'
};

export const bodyParser: BodyParserOpts = {};

export const keys = ['some secret hurr'];

export const session: Partial<SessionOpts> = {
  maxAge: 86400000,
  secure: false /** (boolean) secure cookie*/
};

export const loginRedirect: LoginRedirectConfig = {
  signInPage: '/account/signin'
};

export const auth: AuthConfig = {
  saltKey: 'nice',
  tokenTTL: 1000 * 60 * 60 * 24 * 3 // 3 days
};
