import type { DataSourceOptions } from 'typeorm';

export const mongo: DataSourceOptions = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  username: 'root',
  password: '',
  database: 'test-backend'
};
