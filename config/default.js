const path = require('path');
const appRoot = path.dirname(__dirname);

module.exports = {
  env: process.env.NODE_ENV,
  application: 'dmo',
  port: 6001,
  host: '0.0.0.0', // docker required
  appRoot: appRoot,
  jwt: {
    algorithm: 'HS256',
    secrept: 'xafadf@$#@dafa6%^xAGAYaGFh FG234HRTU78DFHK∆¨∆',
    issuer: 'sangsay.com',
    audience: 'test-backend.sangsay.com',
    jwtid: 'something',
    subject: 'demo',
    ttl: 86400 * 7
  },
  logger: {
    path: path.join(appRoot, '/storage/logs')
  },
  mongoose: {

  }
};
