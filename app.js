'use strict';

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // The config file has been read and merged, but it has not yet taken effect
    // This is the last time the application layer modifies the configuration
    // Note: This function only supports synchronous calls.

    // as early as possible require
    require('appoptics-apm');
  }
}

module.exports = AppBootHook;
