import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../utils/connect'
import { userSchema } from '../utils/schemas'
import { setupConnection } from '../../src/utils/conn'
import { config } from '../../src/utils/config'
import jwt from 'jsonwebtoken'

use(chaijsonSchema)

describe('Testing authorized user routes', () => {
    before(async function () {
        const db = await mongo.connect()
        if (db) await setupConnection(mongo.uri)
    })

    after(async function () {
        const db = await mongo.connect()
       if(db) await db.dropDatabase()
    })

    // POST /user

    it('should fail to create a new user without valid auth token', (done) => {
        const token = jwt.sign({}, 'aaaaaaaaaa')

        request(testServer)
            .post('/users')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel',
                email: 'emmanuel@test.com',
                dob: '1996-05-29',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
            .expect(401)
            .end(done)
    })

    it('should fail to create a new user with missing name', (done) => {
        const token = jwt.sign({}, config.jwtSecret)

        request(testServer)
            .post('/users')
            .set('Authorization', 'bearer ' + token)
            .send({
                email: 'emmanuel@test.com',
                dob: '1996-05-29',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
            .expect(400)
            .end(done)
    })

    it('should fail to create a new user with missing email', (done) => {
        const token = jwt.sign({}, config.jwtSecret)

        request(testServer)
            .post('/users')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel',
                dob: '1996-05-29',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
            .expect(400)
            .end(done)
    })

    it('should fail to create a new user with missing dob', (done) => {
        const token = jwt.sign({}, config.jwtSecret)

        request(testServer)
            .post('/users')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel',
                email: 'emmanuel@test.com',
                address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
                description: 'A versatile back-end node.js developer',
            })
            .expect(400)
            .end(done)
    })

    it('should create a new user', (done) => {
        const token = jwt.sign({}, config.jwtSecret)

        request(testServer)
            .post('/users')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel',
                email: 'emmanuel@test.com',
                dob: '1996-05-29',
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
        const token = jwt.sign({}, config.jwtSecret)

        request(testServer)
            .post('/users')
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Mina',
                email: 'mina@test.com',
                dob: '1996-05-29',
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).to.be.jsonSchema(userSchema)
                done()
            })
    })

    // GET /users

    const savedUserIds: Array<string> = [] // to use in GET users/:id

    it('should fail to get all users with wrong token', (done) => {
        const token = jwt.sign({}, 'aaaaaaaaa')

        request(testServer)
            .get('/users')
            .set('Authorization', 'bearer ' + token)
            .expect(401)
            .end(done)
    })

    it('should get all users', (done) => {
        const token = jwt.sign({}, config.jwtSecret)

        request(testServer)
            .get('/users')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body.length).to.be.equal(2)

                for(const item of res.body) {
                    expect(item).to.be.jsonSchema(userSchema)
                    savedUserIds.push(item.id)
                }
                    
                done()
            })
    })

    // GET /users/:id

    it('should fail to get a user with wrong token', (done) => {
        const token = jwt.sign({}, 'aaaaaaaaa')

        request(testServer)
            .get('/users/' + savedUserIds[0])
            .set('Authorization', 'bearer ' + token)
            .expect(401)
            .end(done)
    })

    it('should fail to get a user with wrong id', (done) => {
        const token = jwt.sign({}, config.jwtSecret)

        request(testServer)
            .get('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .expect(400)
            .end(done)
    })

    it('should get a user by id', (done) => {
        const token = jwt.sign({}, config.jwtSecret)

        request(testServer)
            .get('/users/' + savedUserIds[0])
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
        const token = jwt.sign({ email: 'emmanuel@test.com' }, config.jwtSecret)

        request(testServer)
            .put('/users/' + savedUserIds[0])
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
        const token = jwt.sign({ email: 'mina@test.com' }, config.jwtSecret)

        request(testServer)
            .put('/users/' + savedUserIds[0])
            .set('Authorization', 'bearer ' + token)
            .send({
                name: 'Emmanuel NewName',
                email: 'emmanuel@test.com',
            })
            .expect(403)
            .end(done)
    })

    it('should NOT update the name of a user if user id is wrong', (done) => {
        const token = jwt.sign({ email: 'emmanuel@test.com' }, config.jwtSecret)

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
        const token = jwt.sign({ email: 'emmanuel@test.com' }, config.jwtSecret)

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

    // DELETE /users/:id

    it('should NOT delete the user if request token is not the user themself(403 Forbidden)', (done) => {
        const token = jwt.sign({ email: 'mina@test.com' }, config.jwtSecret)

        request(testServer)
            .delete('/users/' + savedUserIds[0])
            .set('Authorization', 'bearer ' + token)
            .expect(403)
            .end(done)
    })

    it('should NOT delete the user if user id is wrong', (done) => {
        const token = jwt.sign({ email: 'emmanuel@test.com' }, config.jwtSecret)

        request(testServer)
            .delete('/users/' + 'some_bad_id')
            .set('Authorization', 'bearer ' + token)
            .expect(400)
            .end(done)
    })

    it('should NOT delete the user if user id is misiing (405 Method Not Allowed)', (done) => {
        const token = jwt.sign({ email: 'emmanuel@test.com' }, config.jwtSecret)

        request(testServer)
            .delete('/users')
            .set('Authorization', 'bearer ' + token)
            .expect(405)
            .end(done)
    })

    it('should delete the user if request token is user themselves', (done) => {
        const token = jwt.sign({ email: 'emmanuel@test.com' }, config.jwtSecret)

        request(testServer)
            .delete('/users/' + savedUserIds[0])
            .set('Authorization', 'bearer ' + token)
            .expect(204)
            .end(done)
    })

})