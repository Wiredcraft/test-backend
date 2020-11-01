import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../../utils/connect'
import { config } from '../../../src/utils/config'
import jwt from 'jsonwebtoken'
import { getTestDbUser as getTestDatabaseUser, generateDatabaseUsers } from '../../utils/helpers'
import { Db } from 'mongodb'

use(chaijsonSchema)

// global db connection
let database: Db | undefined
;(async () => {
    if (!mongo.db) database = await mongo.connect()
})()

const endpoint = { method: 'GET', route: '/logout' }

describe(`${endpoint.method}: ${endpoint.route}`, () => {
    it('should successfully log out the user', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .get(endpoint.route)
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(200)
        expect(res.text).to.be.equal('logout_success')

        const loggedOutUser = await getTestDatabaseUser(database, users[0]._id)

        if (!loggedOutUser) throw new Error('user_not_found')

        expect(loggedOutUser.refreshToken).to.not.be.equal(users[0].refreshToken)
        expect(loggedOutUser.refreshToken).to.be.equal('removed')
    })
})
