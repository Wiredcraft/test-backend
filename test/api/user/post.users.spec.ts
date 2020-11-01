import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { mongo, testServer } from '../../utils/connect'
import { userSchema } from '../../../src/entity/user'
import { Db } from 'mongodb'
import { generateDatabaseUsers } from '../../utils/helpers'

use(chaijsonSchema)

// global db connection
let database: Db | undefined
;(async () => {
    if (!mongo.db) database = await mongo.connect()
})()

const endpoint = { method: 'POST', route: '/users' }

describe(`${endpoint.method}: ${endpoint.route}`, () => {
    it('should fail to create a new user with missing name', async () => {
        const res = await request(testServer).post(endpoint.route).send({
            email: 'emmanuel@test.com',
            dob: '1996-05-29',
            password: 'AAaa@@88$$99',
            address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
            description: 'A versatile back-end node.js developer',
        })

        expect(res.status).to.be.equal(400)
    })

    it('should fail to create a new user with missing email', async () => {
        const res = await request(testServer).post(endpoint.route).send({
            name: 'Emmanuel',
            dob: '1996-05-29',
            password: 'AAaa@@88$$99',
            address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
            description: 'A versatile back-end node.js developer',
        })

        expect(res.status).to.be.equal(400)
    })

    it('should fail to create a new user with missing dob', async () => {
        const res = await request(testServer).post(endpoint.route).send({
            name: 'Emmanuel',
            email: 'emmanuel@test.com',
            password: 'AAaa@@88$$99',
            address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
            description: 'A versatile back-end node.js developer',
        })
        expect(res.status).to.be.equal(400)
    })

    it('should fail to create a new user with missing password', async () => {
        const res = await request(testServer).post(endpoint.route).send({
            name: 'Emmanuel',
            email: 'emmanuel@test.com',
            dob: '1996-05-29',
            address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
            description: 'A versatile back-end node.js developer',
        })

        expect(res.status).to.be.equal(400)
    })

    it('should fail to create a new user with password that does not meet standards', async () => {
        const res = await request(testServer).post(endpoint.route).send({
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
        const res = await request(testServer).post(endpoint.route).send({
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

    it('should fail to create a user who already exists', async () => {
        const users = await generateDatabaseUsers(database, 1)
        const res = await request(testServer).post(endpoint.route).send({
            name: users[0].name,
            email: users[0].email,
            dob: '1996-05-29',
            password: 'AAaa@@88$$99',
        })
        expect(res.status).to.be.equal(409)
    })

    it('should create a new user without address or description', async () => {
        const res = await request(testServer).post(endpoint.route).send({
            name: 'Mina',
            email: 'mina@test.com',
            dob: '1996-05-29',
            password: 'AAaa@@88$$99',
        })

        expect(res.status).to.be.equal(201)
        expect(res.body).to.be.jsonSchema(userSchema)
    })
})