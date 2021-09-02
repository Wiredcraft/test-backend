'use strict'
const mongoClient = require('../db/mongoClient')
const ObjectId = require('mongodb').ObjectId
class User {
  constructor(id, name, dob, address, description, createdAt) {
    this._constructor(id, name, dob, address, description, createdAt)
  }

  _constructor ({ id, name, dob, address, description, createdAt }) {
    this.id = id
    this.name = name
    this.dob = dob
    this.address = address
    this.description = description
    this.createdAt = createdAt || Date.now()
  }

  /**
   * get user data by id
   * @param {string} id
   * @returns
   */
  async get (id) {
    const collection = await mongoClient.getCollection('users')
    return collection.findOne({ _id: ObjectId(id) })
  }

  /**
  * insert user data
  * @returns
  */
  async create () {
     const collection = await mongoClient.getCollection('users')
     return collection.insertOne(this)
  }

  /**
  * update user data
  * @returns
  */
  async modify (properties) {
    const collection = await mongoClient.getCollection('users')
    return collection.updateOne({ _id: ObjectId(this.id) }, { $set: properties || this })
  }

  /**
  * delete user data
  * @returns
  */
  async remove () {
    const collection = await mongoClient.getCollection('users')
    return collection.deleteOne({ _id: ObjectId(this.id) })
  }
}

module.exports = User