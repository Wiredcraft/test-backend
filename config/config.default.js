'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1490750627161_5967';

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/test_backend',
      options: {}
    },
  };

  config.middleware = [ 'errorHandler' ];

  return config;
};
