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

  describe('Create/Get/Update/Delete user', () => {
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
    let id = ''
    let token = ''
    const checkUserFields = (user, data) => {
      expect(data.id).to.equal(id)
      expect(data.name).to.equal(user.name)
      expect(moment(data.dob).format('YYYY-MM-DD')).to.equal(user.dob)
      expect(data.description).to.equal(user.description)
      expect(data).to.have.property('id')
      expect(data).to.have.property('createdAt')
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

    it('should return the same data after create an user', () => {
      return request
        .post('/api/v1/users')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const data = response.body
          id = data.id
          token = data.token
          checkUserFields(user, data)
        })
    })

    it('should return the same data user get user api', () => {
      return request
        .get(`/api/v1/users/${id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const data = response.body
          checkUserFields(user, data)
        })
    })

    it('should return the same body data when use PUT', () => {
      user.name = 'ezio test from post'
      user.dob = '1988-12-05'
      user.address = 'address 2'
      user.description = 'address 24555'
      return request
        .put(`/api/v1/users/${id}`)
        .send(user)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const data = response.body
          checkUserFields(user, data)
        })
    })

    it('should return the same body data when use Patch', () => {
      user.name = 'ezio test from patch'
      user.dob = '1988-12-07'
      return request
        .patch(`/api/v1/users/${id}`)
        .send({
          name: user.name,
          dob: user.dob
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const data = response.body
          checkUserFields(user, data)
        })
    })

    it('should return user from list', () => {
      return request
        .get('/api/v1/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const data = response.body
          expect(data.total).to.equal(1)
          expect(data.users.length).to.equal(1)
          checkUserFields(user, data.users[0])
        })
    })

    it('should return 204 use delete', () => {
      return request
        .delete(`/api/v1/users/${id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    })
  })
})
