import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../../utils/connect'
import { config } from '../../../src/utils/config'
import jwt from 'jsonwebtoken'
import { generateDatabaseUsers } from '../../utils/helpers'
import { Db } from 'mongodb'

use(chaijsonSchema)

// global db connection
let database: Db | undefined
;(async () => {
    if (!mongo.db) database = await mongo.connect()
})()

const endpoint = { method: 'GET', route: '/refresh' }

describe(`${endpoint.method}: ${endpoint.route}`, () => {
    it('should fail to get a new token with invalid access token', async () => {
        const token = jwt.sign({}, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .get(endpoint.route)
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(403)
    })

    it('should get back same token with a valid access token', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .get(endpoint.route)
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(200)
        expect(res.body.token).to.be.equal(token)
    })

    it('should get back new token with a valid access token', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const now = Math.floor(Date.now() / 1000)
        const token = jwt.sign({ ...testUser, iat: now - 3600, exp: now - 1800 }, config.jwt.accessTokenSecret)

        const res = await request(testServer)
            .get(endpoint.route)
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(200)
        expect(res.body.token).to.not.be.equal(token)
        expect(res.body.token).to.match(/^[\w=-]+\.[\w=-]+\.?[\w+./=-]*$/)
    })
})
