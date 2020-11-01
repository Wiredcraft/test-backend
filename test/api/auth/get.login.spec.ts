import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../../utils/connect'
import { generateDatabaseUsers } from '../../utils/helpers'
import { Db } from 'mongodb'

use(chaijsonSchema)

// global db connection
let database: Db | undefined
;(async () => {
    if (!mongo.db) database = await mongo.connect()
})()

const endpoint = { method: 'GET', route: '/login' }

describe(`${endpoint.method}: ${endpoint.route}`, () => {
    it('should fail to login user with missing email', async () => {
        const res = await request(testServer).post(endpoint.route).send({
            password: 'AAaa@@88$$99',
        })
        expect(res.status).to.be.equal(400)
    })

    it('should fail to login user with missing password', async () => {
        const res = await request(testServer).post(endpoint.route).send({
            email: 'emmanuel@test.com',
        })
        expect(res.status).to.be.equal(400)
    })

    it('should login user successfully', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }

        const res = await request(testServer).post(endpoint.route).send({
            email: testUser.email,
            password: 'AAaa@@88$$99',
        })

        expect(res.status).to.be.equal(200)
        expect(res.body.token).to.match(/^[\w=-]+\.[\w=-]+\.?[\w+./=-]*$/)
    })
})
