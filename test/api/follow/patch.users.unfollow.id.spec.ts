import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../../utils/connect'
import { userSchema } from '../../../src/entity/user'
import { config } from '../../../src/utils/config'
import jwt from 'jsonwebtoken'
import { Db, ObjectID } from 'mongodb'
import { generateDatabaseUsers } from '../../utils/helpers'

use(chaijsonSchema)

// global db connection
let database: Db | undefined
;(async () => {
    if (!mongo.db) database = await mongo.connect()
})()

const endpoint = { method: 'PATCH', route: '/users/unfollow/:id' }

describe(`${endpoint.method}: ${endpoint.route}`, () => {
    it('should fail to unfollow user if user is oneself', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .patch(endpoint.route.replace(':id', testUser.id))
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(400)
        expect(res.text).to.be.equal('cant_unfollow_oneself')
    })

    it('should successfully unfollow another user', async () => {
        const users = await generateDatabaseUsers(database, 2)
        const testUser = { id: users[0]._id, email: users[0].email }
        const secondTestUser = { id: users[1]._id, email: users[1].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        if (database)
            await database
                .collection('user')
                .updateOne({ _id: new ObjectID(testUser.id) }, { $set: { following: [secondTestUser.id] } })

        const res = await request(testServer)
            .patch(endpoint.route.replace(':id', secondTestUser.id))
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(200)
        expect(res.body).to.be.jsonSchema(userSchema)
        expect(res.body.following).to.not.include(secondTestUser.id)
    })
})