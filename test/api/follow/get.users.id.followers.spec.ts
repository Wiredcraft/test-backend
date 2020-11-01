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

const endpoint = { method: 'GET', route: '/users/:id/followers' }

describe(`${endpoint.method}: ${endpoint.route}`, () => {
    it('should fail to get a user with wrong token', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, 'aaaaaaaaa')

        const res = await request(testServer)
            .get(endpoint.route.replace(':id', testUser.id))
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(401)
    })

    it('should fail to get a users followers with wrong id', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .get(endpoint.route.replace(':id', 'some_bad_id'))
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(400)
    })

    it('should get a users followers by id', async () => {
        const users = await generateDatabaseUsers(database, 5)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        // insert followers for the testUser
        if (database)
            await database
                .collection('user')
                .updateMany(
                    { _id: { $in: users.slice(1).map((user) => new ObjectID(user._id)) } },
                    { $set: { following: [testUser.id] } },
                )

        const res = await request(testServer)
            .get(endpoint.route.replace(':id', testUser.id))
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(200)
        expect(res.body.length).to.be.equal(4)
        for (const item of res.body) {
            expect(item).to.be.jsonSchema(userSchema)
        }
    })

})