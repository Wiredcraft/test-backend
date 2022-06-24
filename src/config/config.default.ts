import type { DataSourceOptions } from 'typeorm';
import type { opts as SessionOpts } from 'koa-session';
import { Options as BodyParserOpts } from 'koa-bodyparser';
import type { AuthConfig } from '../middleware/auth';

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

export const auth: AuthConfig = {
  signInPage: '/signin'
};
