import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// To FIX: Add .env file to house sensitive data
const config = {
  name: 'db',
  connector: 'mongodb',
  // url: 'mongodb://root:WiredCraftTest@localhost:27017/wc-test-db.',
  url: '',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'wc-test-db',
  useNewUrlParser: true
};

@lifeCycleObserver('datasource')
export class DbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
