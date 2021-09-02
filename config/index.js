const fs = require('fs')
const path = require('path')
const cert = fs.readFileSync(path.join(__dirname, './rsa_private_key.pem'))// private key

const mongoUrl = 'mongodb://192.168.43.190:27017'
const config = {
    cert,
    mongodb: {
      url: mongoUrl,
      dbName: 'test-dev',
      user: '****',
      password: '*******'
    },
    pageSize: 100
}
module.exports = config