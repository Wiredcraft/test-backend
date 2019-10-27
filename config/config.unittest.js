'use strict';

module.exports = appInfo => {
  const config = {};

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/test_backend_ut',
      options: {}
    },
  };

  return config;
};
