/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1585060316849_5582';

  // add your middleware config here
  config.middleware = [];

  // load the errorHandler middleware
  config.middleware = [ 'errorHandler' ];
  // only takes effect on URL prefix with '/api'
  config.errorHandler = {
    match: '/api',
  };

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/test',
      options: {},
      plugins: [],
    },
  };

  config.passportAuth0 = {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENTID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.logger = {
    level: 'DEBUG',
    allowDebugAtProd: true,
  };
  config.logrotator = {
    filesRotateBySize: [
      path.join(appInfo.root, 'logs', appInfo.name, 'egg-web.log'),
    ],
    maxFileSize: 2 * 1024 * 1024 * 1024,
  };

  return {
    ...config,
    ...userConfig,
  };
};
