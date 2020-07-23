module.exports = {
  port: 9091,
  jwt: {
    secret: 'backend_test_2020',
    expiresIn: 3600000
  },
  mongodbUri: 'mongodb://localhost:27017/backend-test'
}
