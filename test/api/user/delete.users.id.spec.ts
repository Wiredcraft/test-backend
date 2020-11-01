import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../../utils/connect'
import { config } from '../../../src/utils/config'
import jwt from 'jsonwebtoken'
import { Db } from 'mongodb'
import { getTestDbUser as getTestDatabaseUser, generateDatabaseUsers } from '../../utils/helpers'

use(chaijsonSchema)

// global db connection
let database: Db | undefined
;(async () => {
    if (!mongo.db) database = await mongo.connect()
})()

const endpoint = { method: 'DELETE', route: '/users/:id' }

describe(`${endpoint.method}: ${endpoint.route}`, () => {
    it('should NOT delete the user if request token is not the user themself(403 Forbidden)', async () => {
        const users = await generateDatabaseUsers(database, 2)
        const testUser = { id: users[0]._id, email: users[0].email }
        const testUser2 = { id: users[1]._id, email: users[1].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .delete(endpoint.route.replace(':id', testUser2.id))
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(403)
    })

    it('should NOT delete the user if user id is wrong', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .delete(endpoint.route.replace(':id', 'some_bad_id'))
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(400)
    })

    it('should NOT delete the user if user id is misiing (405 Method Not Allowed)', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .delete(endpoint.route.replace(':id', ''))
            .set('Authorization', 'bearer ' + token)
        expect(res.status).to.be.equal(405)
    })

    it('should delete the user if request token is user themselves', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .delete(endpoint.route.replace(':id', testUser.id))
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(204)

        expect(await getTestDatabaseUser(database, testUser.id)).to.be.null
    })
})