import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../../utils/connect'
import { userSchema } from '../../../src/entity/user'
import { config } from '../../../src/utils/config'
import jwt from 'jsonwebtoken'
import { Db } from 'mongodb'
import { generateDatabaseUsers } from '../../utils/helpers'

use(chaijsonSchema)

// global db connection
let database: Db | undefined
;(async () => {
    if (!mongo.db) database = await mongo.connect()
})()

const endpoint = { method: 'PATCH', route: '/users/:id' }

describe(`${endpoint.method}: ${endpoint.route}`, () => {
    it('should update the name of a user if request token is user themselves', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .patch(endpoint.route.replace(':id', testUser.id))
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: testUser.email,
            })

        expect(res.status).to.be.equal(200)
        expect(res.body).to.be.jsonSchema(userSchema)
        expect(res.body.name).to.be.equal('Emmanuel NewName')
    })

    it('should NOT update the name of a user if request token is not the user themself(403 Forbidden)', async () => {
        const users = await generateDatabaseUsers(database, 2)
        const testUser = { id: users[0]._id, email: users[0].email }
        const testUser2 = { id: users[1]._id, email: users[1].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .patch(endpoint.route.replace(':id', testUser2.id))
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })

        expect(res.status).to.be.equal(403)
    })

    it('should NOT update the name of a user if user id is wrong', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .patch(endpoint.route.replace(':id', 'some_bad_id'))
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })

        expect(res.status).to.be.equal(400)
    })

    it('should NOT update the name of a user if user id is misiing (405 Method Not Allowed)', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .patch(endpoint.route.replace(':id', ''))
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })

        expect(res.status).to.be.equal(405)
    })

})