const
  path = require('path');

const config = {
  port: 8001,
  mongo: {
    name: "WiredcraftTestBackend",
    host: "localhost",
    port: 27017
  },
  redis: {
    host: "localhost",
    port: 6379,
    GEOKey: 'WiredcraftTestBackend',
    password: ""
  },
  libPath: path.join(__dirname, '..', 'lib'),
  middlewarePath: path.join(__dirname, '..', 'middleware'),
  servicePath: path.join(__dirname, '..', 'service'),
  mongoDalPath: path.join(__dirname, '..', 'mongo', 'dal'),
  redisPath: path.join(__dirname, '..', 'redis')
}

module.exports = config;