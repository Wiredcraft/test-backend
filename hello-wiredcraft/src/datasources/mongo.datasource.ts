import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {AnyObject, juggler} from '@loopback/repository';
import {
  mongoDbName,
  mongoHost,
  mongoPassword,
  mongoPort,
  mongoUserName,
} from '../config.js';
import config from './mongo.datasource.config.json';

function updateConfig(dsConfig: AnyObject) {
  dsConfig.host = mongoHost;
  dsConfig.port = mongoPort;
  dsConfig.user = mongoUserName;
  dsConfig.password = mongoPassword;
  dsConfig.database = mongoDbName;
}

@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongo';

  constructor(
    @inject('datasources.config.mongo', {optional: true})
    dsConfig: object = config,
  ) {
    updateConfig(dsConfig);
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
