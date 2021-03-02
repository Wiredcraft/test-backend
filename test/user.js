'use strict'

const { expect } = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const User = require('../models/User')
const app = require('..')

describe('test user controller', () => {
  let authorization

  before(() => {
    return request(app)
      .post('/login')
      .send({ user: 'admin', password: '123456' })
      .then(res => {
        authorization = `Bearer ${res.body.access_token}`
      })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should GET /users 200', () => {
    sinon.stub(User, 'find').resolves([])
    return request(app)
      .get('/users')
      .set('Authorization', authorization)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array')
      })
  })

  it('should GET /users/:id 400', () => {
    return request(app)
      .get('/users/abc')
      .set('Authorization', authorization)
      .expect(400)
  })

  it('should GET /users/:id 404', () => {
    sinon.stub(User, 'findById').resolves(undefined)
    return request(app)
      .get('/users/000000000000000000000000')
      .set('Authorization', authorization)
      .expect(404)
  })

  it('should GET /users/:id 200', () => {
    sinon.stub(User, 'findById').resolves({})
    return request(app)
      .get('/users/000000000000000000000000')
      .set('Authorization', authorization)
      .expect(200)
  })

  it('should POST /users 400', () => {
    return request(app)
      .post('/users')
      .set('Authorization', authorization)
      .expect(400)
  })

  it('should POST /users 201', () => {
    sinon.stub(User, 'create').resolves({ id: '000000000000000000000000' })
    return request(app)
      .post('/users')
      .set('Authorization', authorization)
      .send({ name: 'a' })
      .expect(201)
      .then(res => {
        expect(res.body.id).equal('000000000000000000000000')
      })
  })

  it('should PUT /users 400', () => {
    return request(app)
      .put('/users/000000000000000000000000')
      .set('Authorization', authorization)
      .expect(400)
  })

  it('should PUT /users 404', () => {
    sinon.stub(User, 'findById').resolves(undefined)
    return request(app)
      .put('/users/000000000000000000000000')
      .set('Authorization', authorization)
      .send({ name: 'a' })
      .expect(404)
  })

  it('should PUT /users 204', () => {
    sinon.stub(User, 'findById').resolves({ save: () => {} })
    return request(app)
      .put('/users/000000000000000000000000')
      .set('Authorization', authorization)
      .send({ name: 'a' })
      .expect(204)
  })

  it('should DELETE /users 400', () => {
    return request(app)
      .delete('/users/abc')
      .set('Authorization', authorization)
      .expect(400)
  })

  it('should DELETE /users 404', () => {
    sinon.stub(User, 'findById').resolves(undefined)
    return request(app)
      .delete('/users/000000000000000000000000')
      .set('Authorization', authorization)
      .expect(404)
  })

  it('should DELETE /users 204', () => {
    sinon.stub(User, 'findById').resolves({ delete: () => {} })
    return request(app)
      .delete('/users/000000000000000000000000')
      .set('Authorization', authorization)
      .expect(204)
  })
})