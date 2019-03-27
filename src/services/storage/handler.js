let MongoClient = require('mongodb')
const ObjectID = require('mongodb').ObjectID
const { mongo } = require('../../config/vars')
const logger = require('../../config/logger')

let db

let connect = async function () {
  try {
    db = await MongoClient.connect(mongo.uri)

    return db
  } catch (e) {
    logger.error(e)
    throw e
  }
}

let disconnect = async function () {
  try {
    await db.close()
    db = null
  } catch (e) {
    logger.error(e)
    throw e
  }
}

let insert = async function (collection, item) {
  try {
    const result = await db.collection(collection).insert(item)
    return result.ops[0]
  } catch (e) {
    logger.error(e)
  }
}

let fetch = async function (collection, id) {
  try {
    return await db.collection(collection).findOne({ _id: ObjectID(id) })
  } catch (e) {
    logger.error(e)
  }
}

let list = async function (collection) {
  try {
    return await db.collection(collection).find({ })
  } catch (e) {
    logger.error(e)
  }
}

let fetchAdmin = async function (username) {
  try {
    return await db.collection('administrator').findOne({ 'username': username })
  } catch (e) {
    logger.error(e)
  }
}

let update = async function (collection, _id, input) {
  try {
    let result = await db.collection(collection).findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $set: input },
      { returnOriginal: false }
    )
    return result.value
  } catch (e) {
    logger.error(e)
  }
}

let deleteOne = async function (collection, id) {
  try {
    let result = await db.collection(collection).findOneAndDelete({ _id: ObjectID(id) })
    return result.value
  } catch (e) {
    logger.error(e)
  }
}

module.exports = {
  connect, disconnect, insert, fetch, update, deleteOne, fetchAdmin, list
}
