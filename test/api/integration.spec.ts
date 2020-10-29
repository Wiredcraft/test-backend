import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../utils/connect'
import { userSchema } from '../../src/entity/user'
import { setupConnection } from '../../src/utils/conn'
import { config } from '../../src/utils/config'
import jwt from 'jsonwebtoken'
import { Db } from 'mongodb'
import { printTestDbUsers, insertTestDbUsers, clearTestDbUsers, getTestDbUser } from '../utils/helpers'
import users from './fixtures/users.json'

use(chaijsonSchema)

// reuse the same connection
let db: Db | undefined
const savedUserIds: Array<Record<string, any>> = users.map(doc => ({ id: doc._id, email: doc.email }))

describe('Testing all non-index routes', () => {
    before(async function () {
        db = await mongo.connect()
        if (db) {
            console.log(db.databaseName)
            await setupConnection(mongo.uri)
        }
    })

    beforeEach(async function () {
        await clearTestDbUsers(db)
    })

    after(async function () {
        if (db) await db.dropDatabase()
    })

    // POST /user

    it('should fail to create a new user with missing name', (done) => {
        request(testServer)
            .post('/users')
            .send({
                email: 'emmanuel@test.com',
                dob: '1996-05-29',
                password: 'AAaa@@88$$99',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
            .expect(400)
            .end(done)
    })

    it('should fail to create a new user with missing email', (done) => {
        request(testServer)
            .post('/users')
            .send({
                name: 'Emmanuel',
                dob: '1996-05-29',
                password: 'AAaa@@88$$99',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
            .expect(400)
            .end(done)
    })

    it('should fail to create a new user with missing dob', (done) => {
        request(testServer)
            .post('/users')
            .send({
                name: 'Emmanuel',
                email: 'emmanuel@test.com',
                password: 'AAaa@@88$$99',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
            .expect(400)
            .end(done)
    })

    it('should fail to create a new user with missing password', (done) => {
        request(testServer)
            .post('/users')
            .send({
                name: 'Emmanuel',
                email: 'emmanuel@test.com',
                dob: '1996-05-29',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
            .expect(400)
            .end(done)
    })

    it('should fail to create a new user with password that does not meet standards', (done) => {
        request(testServer)
            .post('/users')
            .send({
                name: 'Emmanuel',
                email: 'emmanuel@test.com',
                dob: '1996-05-29',
                password: 'AAaaretrtret',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
            .expect(400)
            .end(done)
    })

    it('should create a new user', (done) => {
        request(testServer)
            .post('/users')
            .send({
                name: 'Emmanuel',
                email: 'emmanuel@test.com',
                dob: '1996-05-29',
                password: 'AAaa@@88$$99',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).to.be.jsonSchema(userSchema)
                done()
            })
    })

    it('should create a new user without address or description', (done) => {
        request(testServer)
            .post('/users')
            .send({
                name: 'Mina',
                email: 'mina@test.com',
                dob: '1996-05-29',
                password: 'AAaa@@88$$99',
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).to.be.jsonSchema(userSchema)
                done()
            })
    })

    // GET /users

    it('should fail to get all users with wrong token', async () => {
        const token = jwt.sign({}, 'aaaaaaaaa')

        await insertTestDbUsers(db, users)

        request(testServer)
            .get('/users')
            .set('Authorization', 'bearer ' + token)
            .expect(401)
    })

    it('should get all users', async () => {
        const token = jwt.sign({}, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .get('/users')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) throw err
                expect(res.body.length).to.be.equal(2)

                for (const item of res.body) {
                    expect(item).to.be.jsonSchema(userSchema)
                }
            })
    })

    // GET /users/:id

    it('should fail to get a user with wrong token', async () => {
        const token = jwt.sign(savedUserIds[0], 'aaaaaaaaa')

        await insertTestDbUsers(db, users)

        request(testServer)
            .get('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .expect(401)
    })

    it('should fail to get a user with wrong id', async () => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .get('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .expect(400)
    })

    it('should fail to get a user with wrong id', async () => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .get('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .expect(400)
    })

    it('should get a user by id', async () => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .get('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) throw err
                expect(res.body).to.be.jsonSchema(userSchema)
            })
    })

    // PUT /users/:id

    it('should update the name of a user if request token is user themselves', async () => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .put('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })
            .expect(200)
            .end((err, res) => {
                if (err) throw err
                expect(res.body).to.be.jsonSchema(userSchema)
                expect(res.body.name).to.be.equal('Emmanuel NewName')
            })
    })

    it('should NOT update the name of a user if request token is not the user themself(403 Forbidden)', async () => {
        const token = jwt.sign(savedUserIds[1], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .put('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })
            .expect(403)
    })

    it('should NOT update the name of a user if user id is wrong', async () => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .put('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })
            .expect(400)
    })

    it('should NOT update the name of a user if user id is misiing (405 Method Not Allowed)', async () => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .put('/users')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })
            .expect(405)
    })

    // AUTH /login

    it('should fail to login user with missing email', async () => {
        await insertTestDbUsers(db, users)

        request(testServer)
            .post('/login')
            .send({
                // email: 'emmanuel@test.com',
                password: 'AAaa@@88$$99',
            })
            .expect(400)
    })

    it('should fail to login user with missing password', async () => {
        await insertTestDbUsers(db, users)

        request(testServer)
            .post('/login')
            .send({
                email: 'emmanuel@test.com',
                // password: 'AAaa@@88$$99',
            })
            .expect(400)
    })

    it('should login user successfully', async () => {
        await insertTestDbUsers(db, users)

        request(testServer)
            .post('/login')
            .send({
                email: 'emmanuel@test.com',
                password: 'AAaa@@88$$99',
            })
            .expect(200)
            .end((err, res) => {
                if (err) throw err
                expect(res.body.token).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
            })
    })

    // AUTH /refresh

    it.skip('should fail to get a new token with invalid access token', async () => {
        const token = jwt.sign({}, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        users[0].refreshToken = jwt.sign({ email: savedUserIds[0].email }, config.jwt.refreshTokenSecret, {
            expiresIn: config.jwt.refreshTokenLife,
        })

        await insertTestDbUsers(db, users)

        request(testServer)
            .get('/refresh')
            .set('Authorization', 'bearer ' + token)
            .expect(403)
    })

    it('should get back same token with a valid access token', async() => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        users[0].refreshToken = jwt.sign({ email: savedUserIds[0].email }, config.jwt.refreshTokenSecret, {
            expiresIn: config.jwt.refreshTokenLife,
        })

        await insertTestDbUsers(db, users)

        request(testServer)
            .get('/refresh')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) throw err
                expect(res.body.token).to.be.equal(token)
            })
    })

    it('should get back new token with a valid access token', async () => {
        const now = Math.floor(Date.now() / 1000)

        const token = jwt.sign({ ...savedUserIds[0], iat: now - 3600, exp: now - 1800 }, config.jwt.accessTokenSecret)

        users[0].refreshToken = jwt.sign({ email: savedUserIds[0].email }, config.jwt.refreshTokenSecret, {
            expiresIn: config.jwt.refreshTokenLife,
        })

        await insertTestDbUsers(db, users)

        request(testServer)
            .get('/refresh')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) throw err
                expect(res.body.token).to.not.be.equal(token)
                expect(res.body.token).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
            })
    })

    // AUTH /logout

    it('should successfully log out the user', async () => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        users[0].refreshToken = jwt.sign({ email: savedUserIds[0].email }, config.jwt.refreshTokenSecret, {
            expiresIn: config.jwt.refreshTokenLife,
        })

        await insertTestDbUsers(db, users)
        await printTestDbUsers(db)

        request(testServer)
            .get('/logout')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end(async (err, res) => {
                if (err) return err
                expect(res.text).to.be.equal('logout_success')
                const loggedOutUser = await getTestDbUser(db, savedUserIds[0].id)
                await printTestDbUsers(db)

                if(!loggedOutUser) throw new Error('user_not_found')
                expect(loggedOutUser.refreshToken).to.not.be.equal(users[0].refreshToken)
                expect(loggedOutUser.refreshToken).to.be.equal('removed')
            })
    })

    // DELETE /users/:id

    it('should NOT delete the user if request token is not the user themself(403 Forbidden)', async () => {
        const token = jwt.sign(savedUserIds[1], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .delete('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .expect(403)
            .end()
    })

    it('should NOT delete the user if user id is wrong', async () => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .delete('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .expect(400)
            .end()
    })

    it('should NOT delete the user if user id is misiing (405 Method Not Allowed)', async () => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)

        request(testServer)
            .delete('/users')
            .set('Authorization', 'bearer ' + token)
            .expect(405)
            .end()
    })

    it('should delete the user if request token is user themselves', async () => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        await insertTestDbUsers(db, users)
        
        request(testServer)
            .delete('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .expect(204)
            .end()
    })
})
