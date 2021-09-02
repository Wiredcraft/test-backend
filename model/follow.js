'use strict'
const mongoClient = require('../db/mongoClient')
const ObjectId = require('mongodb').ObjectId
const pageSize = require('../config/index').pageSize

class Follow {
    constructor(uid, followingUid) {
        this._constructor(uid, followingUid)
    }

    _constructor ({ uid, followingUid, followed, updatedAt, createdAt }) {
        this.uid = uid
        this.followingUid = followingUid
        this.followed = false || followed
        this.updatedAt = updatedAt || Date.now()
        this.createdAt = createdAt || Date.now()
    }

    async follow () {
        const collection = await mongoClient.getCollection('follows')
        const query = { uid: this.followingUid, followingUid: this.uid }
        const record = await collection.findOne(query)
        if (record) {
            this.followed = true
        }
        await collection.insertOne(this)
        return collection.updateOne(query, { $set: { followed: true } })
    }

    async unfollow () {
        const collection = await mongoClient.getCollection('follows')
        const query = { uid: uid, followingUid: followingUid }
        const record = await collection.findOne(query)
        if (record && record.followed) {
            await collection.findOneAndUpdate({ uid: followingUid, followingUid: uid}, { $set: { followed: false } })
        }
        return collection.deleteOne(record)
    }

    static async getFollowingUids (uid) {
        const collection = await mongoClient.getCollection('follows')
        const query = { uid: uid }
        return collection.find(query).sort({ _id: 1 }).limit(pageSize).toArray()
    }

    static async getFriends (uid) {
        const collection = await mongoClient.getCollection('follows')
        const query = { uid: uid, followed: true }
        return collection.find(query).sort({ _id: 1 }).limit(pageSize).toArray()
    }
}

module.exports = Follow