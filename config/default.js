module.exports = {
  listen: {
    host: '0.0.0.0',
    port: 9090
  },
  log: {
    level: 'debug'
  },
  jwt: {
    secret: 'backend_2020',
    expiresIn: 3600000
  },
  mongodbUri: 'mongodb://localhost:27017/backend'
}
