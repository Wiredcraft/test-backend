import {ValueOrPromise} from '@loopback/core';
import {juggler} from '@loopback/repository';

class TestDB extends juggler.DataSource {
  constructor() {
    super({
      name: 'db',
      connector: 'memory',
    });
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

export const testDB = new TestDB();
