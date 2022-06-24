import type { DataSourceOptions } from 'typeorm';

export const keys = ['some secret hurr'];

export const mongo: DataSourceOptions = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  username: 'root',
  password: '',
  database: 'test-backend'
};

export const bodyParser = {};

export const session = {
  maxAge: 86400000,
  secure: false /** (boolean) secure cookie*/
};
