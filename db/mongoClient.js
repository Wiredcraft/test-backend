const { mongodb } = require('../config')
const MongoClient = require('mongodb').MongoClient

// Database Name
const dbName = mongodb.dbName
const client = new MongoClient(mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true, auth: { user: mongodb.user, password: mongodb.password } })
client.connect(async function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('mongoClinet connect seccuess')
})

async function getCollection (collName) {
  if (client.isConnected()) {
    return client.db(dbName).collection(collName)
  }
  const myClient = await client.connect()
  return myClient.db(dbName).collection(collName)
}

module.exports = { getCollection }
