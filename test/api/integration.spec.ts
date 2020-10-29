import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../utils/connect'
import { userSchema } from '../../src/entity/user'
import { setupConnection } from '../../src/utils/conn'
import { config } from '../../src/utils/config'
import jwt from 'jsonwebtoken'
import { Db } from 'mongodb'
import { getTestDbUser, generateDatabaseUsers } from '../utils/helpers'

use(chaijsonSchema)

// reuse the same connection
let db: Db | undefined

describe('Testing all non-index routes', () => {
    before(async function () {
        db = await mongo.connect()
        if (db) {
            console.log(db.databaseName)
            await setupConnection(mongo.uri)
        }
    })

    after(async function () {
        if (db) await db.dropDatabase()
    })

    // POST /user

    it('should fail to create a new user with missing name', async () => {
        const res = await request(testServer)
            .post('/users')
            .send({
                email: 'emmanuel@test.com',
                dob: '1996-05-29',
                password: 'AAaa@@88$$99',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })

        expect(res.status).to.be.equal(400)
    })

    it('should fail to create a new user with missing email', async() => {
        const res = await request(testServer)
            .post('/users')
            .send({
                name: 'Emmanuel',
                dob: '1996-05-29',
                password: 'AAaa@@88$$99',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })

        expect(res.status).to.be.equal(400)
    })

    it('should fail to create a new user with missing dob', async () => {
        const res = await request(testServer)
            .post('/users')
            .send({
                name: 'Emmanuel',
                email: 'emmanuel@test.com',
                password: 'AAaa@@88$$99',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
        expect(res.status).to.be.equal(400)
    })

    it('should fail to create a new user with missing password', async () => {
        const res = await request(testServer)
            .post('/users')
            .send({
                name: 'Emmanuel',
                email: 'emmanuel@test.com',
                dob: '1996-05-29',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
        
        expect(res.status).to.be.equal(400)
    })

    it('should fail to create a new user with password that does not meet standards', async () => {
        const res = await request(testServer)
            .post('/users')
            .send({
                name: 'Emmanuel',
                email: 'emmanuel@test.com',
                dob: '1996-05-29',
                password: 'AAaaretrtret',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
        expect(res.status).to.be.equal(400)
    })

    it('should create a new user', async () => {
        const res = await request(testServer).post('/users').send({
            name: 'Emmanuel',
            email: 'emmanuel@test.com',
            dob: '1996-05-29',
            password: 'AAaa@@88$$99',
            address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
            description: 'A versatile back-end node.js developer',
        })

        expect(res.status).to.be.equal(201)
        expect(res.body).to.be.jsonSchema(userSchema)
    })

    it('should create a new user without address or description', async () => {
        const res = await request(testServer).post('/users').send({
            name: 'Mina',
            email: 'mina@test.com',
            dob: '1996-05-29',
            password: 'AAaa@@88$$99',
        })

        expect(res.status).to.be.equal(201)
        expect(res.body).to.be.jsonSchema(userSchema)
    })

    // GET /users

    it('should fail to get all users with wrong token', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, 'aaaaaaaaa')

        const res = await request(testServer)
            .get('/users')
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(401)
    })

    it('should get all users', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .get('/users')
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(200)
        expect(res.body.length).to.be.greaterThan(0)

        for (const item of res.body) {
            expect(item).to.be.jsonSchema(userSchema)
        }
    })

    // GET /users/:id

    it('should fail to get a user with wrong token', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, 'aaaaaaaaa')

        const res = await request(testServer)
            .get('/users/' + testUser.id)
            .set('Authorization', 'bearer ' + token)
        
        expect(res.status).to.be.equal(401)
    })

    it('should fail to get a user with wrong id', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .get('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(400)       
    })

    it('should get a user by id', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })


        const res = await request(testServer)
            .get('/users/' + testUser.id)
            .set('Authorization', 'bearer ' + token)
       
        expect(res.status).to.be.equal(200)     
        expect(res.body).to.be.jsonSchema(userSchema)
    })

    // PUT /users/:id

    it('should update the name of a user if request token is user themselves', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .put('/users/' + testUser.id)
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
        const users = await generateDatabaseUsers(db, 2)
        const testUser = { id: users[0]._id, email: users[0].email }
        const testUser2 = { id: users[1]._id, email: users[1].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .put('/users/' + testUser2.id)
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })

        expect(res.status).to.be.equal(403) 
    })

    it('should NOT update the name of a user if user id is wrong', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .put('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })

        expect(res.status).to.be.equal(400) 
    })

    it('should NOT update the name of a user if user id is misiing (405 Method Not Allowed)', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .put('/users')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })
        
        expect(res.status).to.be.equal(405)
    })

    // AUTH /login

    it('should fail to login user with missing email', async () => {
        const res = await request(testServer)
            .post('/login')
            .send({
                password: 'AAaa@@88$$99',
            })
        expect(res.status).to.be.equal(400)
    })

    it('should fail to login user with missing password', async () => {
        const res = await request(testServer)
            .post('/login')
            .send({
                email: 'emmanuel@test.com',
            })
        expect(res.status).to.be.equal(400)
    })

    it('should login user successfully', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }

        const res = await request(testServer)
            .post('/login')
            .send({
                email: testUser.email,
                password: 'AAaa@@88$$99',
            })
        
        expect(res.status).to.be.equal(200)
        expect(res.body.token).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
    })

    // AUTH /refresh

    it('should fail to get a new token with invalid access token', async () => {
        const token = jwt.sign({}, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .get('/refresh')
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(403)
    })

    it('should get back same token with a valid access token', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .get('/refresh')
            .set('Authorization', 'bearer ' + token)
        
        expect(res.status).to.be.equal(200)
        expect(res.body.token).to.be.equal(token)
    })

    it('should get back new token with a valid access token', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const now = Math.floor(Date.now() / 1000)
        const token = jwt.sign({ ...testUser, iat: now - 3600, exp: now - 1800 }, config.jwt.accessTokenSecret)

        const res = await request(testServer)
            .get('/refresh')
            .set('Authorization', 'bearer ' + token)
        
        expect(res.status).to.be.equal(200)
        expect(res.body.token).to.not.be.equal(token)
        expect(res.body.token).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
    })

    // AUTH /logout

    it('should successfully log out the user', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .get('/logout')
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(200)
        expect(res.text).to.be.equal('logout_success')

        const loggedOutUser = await getTestDbUser(db, users[0]._id)

        if (!loggedOutUser) throw new Error('user_not_found')

        expect(loggedOutUser.refreshToken).to.not.be.equal(users[0].refreshToken)
        expect(loggedOutUser.refreshToken).to.be.equal('removed')
    })

    // DELETE /users/:id

    it('should NOT delete the user if request token is not the user themself(403 Forbidden)', async () => {
        const users = await generateDatabaseUsers(db, 2)
        const testUser = { id: users[0]._id, email: users[0].email }
        const testUser2 = { id: users[1]._id, email: users[1].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .delete('/users/' + testUser2.id)
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(403)
    })

    it('should NOT delete the user if user id is wrong', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .delete('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)

        expect(res.status).to.be.equal(400)
    })

    it('should NOT delete the user if user id is misiing (405 Method Not Allowed)', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .delete('/users')
            .set('Authorization', 'bearer ' + token)
        expect(res.status).to.be.equal(405)
    })

    it('should delete the user if request token is user themselves', async () => {
        const users = await generateDatabaseUsers(db, 1)
        const testUser = { id: users[0]._id, email: users[0].email }
        const token = jwt.sign(testUser, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        const res = await request(testServer)
            .delete('/users/' + testUser.id)
            .set('Authorization', 'bearer ' + token)
        
        expect(res.status).to.be.equal(204)
    })
})
