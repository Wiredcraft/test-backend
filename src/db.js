const EventEmitter = require('events').EventEmitter
const { MongoClient, ObjectID } = require('mongodb')


module.exports = class Db extends EventEmitter {
  constructor (config) {
    super()
    MongoClient.connect(config.url, (err, client) => {
      if (err) {
        this.emit('error', `unable to connect to MongoDB instance. Is it running at ${config.url}`)
        return
      }
      this.client = client
      this.db = client.db(config.name)
      this.emit('ready')
    })
  }

  create (collectionName, data) {
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).insertOne(data, (err, r) => {
        if (err) {
          reject(err)
          return
        }
        const item = r.ops[0]
        item.id = r.insertedId
        delete item._id
        resolve(item)
      })
    })
  }

  get (collectionName, id) {
    return new Promise((resolve, reject) => {
      let oid 
      try {
        oid = ObjectID(id)
      } catch (e) {
        reject(new Error('Invalid id provided'))
        return
      }
      this.db.collection(collectionName).findOne({ _id: oid }, (err, result) => {
        if (err) {
          reject(err)
        } else if (!result) {
          resolve(null)
        } else {
          result.id = result._id
          delete result._id
          resolve(result)
        }
      })
    })
  }

  async update (collectionName, id, attributes) {
    let oid 
    try {
      oid = ObjectID(id)
    } catch (e) {
      throw new Error('Invalid id provided')
    }
    const result = await this.db.collection(collectionName).findOneAndUpdate(
      { _id: oid }, attributes, { upsert: false }
    )

    if (!result.value) {
      throw new Error('Item not found')
    }
    return
  }

  async delete (collectionName, id) {
    let oid
    try {
      oid = ObjectID(id)
    } catch (e) {
      throw new Error('Invalid id provided')
    }
    return await this.db.collection(collectionName).deleteOne({ _id: oid })
  }

  close () {
    this.client.close(() => this.emit('close'))
  }
}
