'use strict'

const { expect } = require('chai')
const request = require('supertest')
const app = require('..')

describe('test auth', () => {
  it('should return 401 if no Authorization header', () => {
    return request(app)
      .get('/users')
      .expect(401)
  })

  it('should return 401 if send wrong Authorization header', () => {
    return request(app)
      .get('/users')
      .set('Authorization', 'Bearer abcdefg')
      .expect(401)
  })

  it('should return 401 if login failed', () => {
    return request(app)
      .post('/login')
      .expect(401)
  })

  it('should return access_token if login successed', () => {
    return request(app)
      .post('/login')
      .send({ user: 'admin', password: '123456' })
      .expect(200)
      .then(res => {
        const body = res.body
        expect(body.access_token).to.be.an('string')
        expect(body.token_type).equal('bearer')
        expect(body.expires_in).to.be.an('number')
      })
  })

  it('should ok if send right Authorization header', async () => {
    const { access_token } = await request(app)
      .post('/login')
      .send({ user: 'admin', password: '123456' })
      .then(res => res.body)
    
    return request(app)
      .get('/users')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
  })
})