const app = require('../app')
const db = require('../db')
const config = require('config')
const moment = require('moment')
const supertest = require('supertest')
const chai = require('chai')
const { expect } = chai

describe('User Api Test', () => {
  let request = {}
  let server = {}

  before(async () => {
    server = app.listen(config.listen.port)
    await db.db.dropDatabase()
    request = supertest(server)
  })
  after(async () => {
    server.close()
    await db.db.dropDatabase()
  })

  describe('Create users', () => {
    it('should return empty result at first time', () => {
      return request
        .get('/api/v1/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const data = response.body
          expect(data.total).to.equal(0)
          expect(data.users.length).to.equal(0)
        })
    })

    const user = {
      name: 'ezio',
      dob: '2020-12-31',
      address: 'Fujian China',
      description: 'I am badman'
    }
    it('should return errorCode when pass invalid data', () => {
      return request
        .post('/api/v1/users')
        .set('Accept', 'application/json')
        .send({
          ...user,
          dob: 'dob'
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => {
          const data = response.body
          expect(data).to.have.property('errorCode')
          expect(data).to.have.property('message')
        })
    })
    it('should return the same data when create an user', () => {
      return request
        .post('/api/v1/users')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const data = response.body
          expect(data.name).to.equal(user.name)
          expect(moment(data.dob).format('YYYY-MM-DD')).to.equal(user.dob)
          expect(data.description).to.equal(user.description)
          expect(data).to.have.property('id')
          expect(data).to.have.property('createdAt')
        })
    })
  })
})
