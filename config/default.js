const path = require('path');
const appRoot = path.dirname(__dirname);

module.exports = {
  admin: 'shisang',
  env: process.env.NODE_ENV,
  application: 'dmo',
  port: 6001,
  host: '0.0.0.0', // docker required
  appRoot: appRoot,
  salt: 'adfasf@34#%$YHg',
  jwt: {
    secret: 'xafadf@$#@dafa6%^xAGAYaGFh FG234HRTU78DFHK∆¨∆',
    options: {
      algorithm: 'HS256',
      issuer: 'sangsay.com',
      audience: 'test-backend.sangsay.com',
      jwtid: 'something',
      subject: 'demo'
    },
    ttl: 86400 * 7
  },
  logger: {
    path: path.join(appRoot, '/storage/logs')
  },
  mongoose: {
    debug: true,
    uri: 'mongodb://localhost:27017/demo'
  }
};
