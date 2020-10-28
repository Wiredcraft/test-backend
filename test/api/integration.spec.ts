import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../utils/connect'
import { userSchema } from '../../src/entity/user'
import { setupConnection } from '../../src/utils/conn'
import { config } from '../../src/utils/config'
import jwt from 'jsonwebtoken'

use(chaijsonSchema)

describe('Testing all non-index routes', () => {
    before(async function () {
        const db = await mongo.connect()
        if (db) await setupConnection(mongo.uri)
    })

    after(async function () {
        const db = await mongo.connect()
        if(db) await db.dropDatabase()
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
                password: 'AAaa@@88$$99'
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).to.be.jsonSchema(userSchema)
                done()
            })
    })

    // GET /users

    const savedUserIds: Array<Record<string, any>> = [] // to use in GET users/:id

    it('should fail to get all users with wrong token', (done) => {
        const token = jwt.sign({}, 'aaaaaaaaa')

        request(testServer)
            .get('/users')
            .set('Authorization', 'bearer ' + token)
            .expect(401)
            .end(done)
    })

    it('should get all users', (done) => {
        const token = jwt.sign({}, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .get('/users')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body.length).to.be.equal(2)

                for(const item of res.body) {
                    expect(item).to.be.jsonSchema(userSchema)
                    savedUserIds.push({ id: item.id, email: item.email })
                }
                    
                done()
            })
    })

    // GET /users/:id

    it('should fail to get a user with wrong token', (done) => {
        const token = jwt.sign(savedUserIds[0], 'aaaaaaaaa')

        request(testServer)
            .get('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .expect(401)
            .end(done)
    })

    it('should fail to get a user with wrong id', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .get('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .expect(400)
            .end(done)
    })

    it('should fail to get a user with wrong id', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .get('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .expect(400)
            .end(done)
    })

    it('should get a user by id', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .get('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).to.be.jsonSchema(userSchema)
                    
                done()
            })
    })

    // PUT /users/:id

    it('should update the name of a user if request token is user themselves', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .put('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).to.be.jsonSchema(userSchema)
                expect(res.body.name).to.be.equal('Emmanuel NewName')
                done()
            })
    })

    it('should NOT update the name of a user if request token is not the user themself(403 Forbidden)', (done) => {
        const token = jwt.sign(savedUserIds[1],config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .put('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })
            .expect(403)
            .end(done)
    })

    it('should NOT update the name of a user if user id is wrong', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .put('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })
            .expect(400)
            .end(done)
    })

    it('should NOT update the name of a user if user id is misiing (405 Method Not Allowed)', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .put('/users')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })
            .expect(405)
            .end(done)
    })

    // AUTH /login

    it('should fail to login user with missing email', (done) => {
        request(testServer)
            .post('/login')
            .send({
                // email: 'emmanuel@test.com',
                password: 'AAaa@@88$$99',
            })
            .expect(400)
            .end(done)
    })

    it('should fail to login user with missing password', (done) => {
        request(testServer)
            .post('/login')
            .send({
                email: 'emmanuel@test.com',
                // password: 'AAaa@@88$$99',
            })
            .expect(400)
            .end(done)
    })

    it('should login user successfully', (done) => {
        request(testServer)
            .post('/login')
            .send({
                email: 'emmanuel@test.com',
                password: 'AAaa@@88$$99',
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body.token).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
                done()
            })
    })

    // AUTH /refresh

    it('should fail to get a new token with invalid access token', (done) => {
        const token = jwt.sign({}, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .get('/refresh')
            .set('Authorization', 'bearer ' + token)
            .expect(401)
            .end(done)
    })

    it('should get back same token with a valid access token', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .get('/refresh')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body.token).to.be.equal(token)
                done()
            })
    })

    it('should get back new token with a valid access token', (done) => {
        const now = Math.floor(Date.now() /1000)

        const token = jwt.sign({ ...savedUserIds[0], iat: now - 3600, exp: now - 1800 }, config.jwt.accessTokenSecret)

        request(testServer)
            .get('/refresh')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body.token).to.not.be.equal(token)
                expect(res.body.token).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
                done()
            })
    })

    // AUTH /logout

    it('should successfully log out the user', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .get('/logout')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end(async (err, res) => {
                if (err) return done(err)
                expect(res.text).to.be.equal('Succcessfully logged out')
                done()
            })
    })

    // DELETE /users/:id

    it('should NOT delete the user if request token is not the user themself(403 Forbidden)', (done) => {
        const token = jwt.sign(savedUserIds[1], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .delete('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .expect(403)
            .end(done)
    })

    it('should NOT delete the user if user id is wrong', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .delete('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .expect(400)
            .end(done)
    })

    it('should NOT delete the user if user id is misiing (405 Method Not Allowed)', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .delete('/users')
            .set('Authorization', 'bearer ' + token)
            .expect(405)
            .end(done)
    })

    it('should delete the user if request token is user themselves', (done) => {
        const token = jwt.sign(savedUserIds[0], config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenLife })

        request(testServer)
            .delete('/users/' + savedUserIds[0].id)
            .set('Authorization', 'bearer ' + token)
            .expect(204)
            .end(done)
    })

})