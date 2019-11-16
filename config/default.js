const path = require('path');

module.exports = {
  env: process.env.NODE_ENV,
  application: 'dmo',
  port: 6000,
  host: '0.0.0.0', // docker required
  webRoot: path.dirname(__dirname),
  jwt: {
    algorithm: 'HS256',
    secrept: 'xafadf@$#@dafa6%^xAGAYaGFh FG234HRTU78DFHK∆¨∆',
    issuer: 'sangsay.com',
    audience: 'test-backend.sangsay.com',
    jwtid: 'something',
    subject: 'demo',
    ttl: 86400 * 7
  },
  mongoose: {

  }
};
