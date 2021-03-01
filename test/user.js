'use strict'

const { expect } = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const User = require('../models/User')
const app = require('..')

describe('test user controller', () => {
  beforeEach(() => {
    sinon.replace(console, 'log', sinon.fake())
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should GET /users 200', () => {
    sinon.stub(User, 'find').resolves([])
    return request(app)
      .get('/users')
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array')
      })
  })

  it('should GET /users/:id 400', () => {
    return request(app)
      .get('/users/abc')
      .expect(400)
  })

  it('should GET /users/:id 404', () => {
    sinon.stub(User, 'findById').resolves(undefined)
    return request(app)
      .get('/users/000000000000000000000000')
      .expect(404)
  })

  it('should GET /users/:id 200', () => {
    sinon.stub(User, 'findById').resolves({})
    return request(app)
      .get('/users/000000000000000000000000')
      .expect(200)
  })

  it('should POST /users 400', () => {
    return request(app)
      .post('/users')
      .expect(400)
  })

  it('should POST /users 201', () => {
    sinon.stub(User, 'create').resolves({ id: '000000000000000000000000' })
    return request(app)
      .post('/users')
      .send({ name: 'a' })
      .expect(201)
      .then(res => {
        expect(res.body.id).equal('000000000000000000000000')
      })
  })

  it('should PUT /users 400', () => {
    return request(app)
      .put('/users/000000000000000000000000')
      .expect(400)
  })

  it('should PUT /users 404', () => {
    sinon.stub(User, 'findById').resolves(undefined)
    return request(app)
      .put('/users/000000000000000000000000')
      .send({ name: 'a' })
      .expect(404)
  })

  it('should PUT /users 204', () => {
    sinon.stub(User, 'findById').resolves({ save: () => {} })
    return request(app)
      .put('/users/000000000000000000000000')
      .send({ name: 'a' })
      .expect(204)
  })

  it('should DELETE /users 400', () => {
    return request(app)
      .delete('/users/abc')
      .expect(400)
  })

  it('should DELETE /users 404', () => {
    sinon.stub(User, 'findById').resolves(undefined)
    return request(app)
      .delete('/users/000000000000000000000000')
      .expect(404)
  })

  it('should DELETE /users 204', () => {
    sinon.stub(User, 'findById').resolves({ delete: () => {} })
    return request(app)
      .delete('/users/000000000000000000000000')
      .expect(204)
  })
})