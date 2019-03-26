const app = require('../../src/services/http/handler')
const request = require('supertest')
const { expect } = require('chai')

let server

beforeEach(async () => {
  server = app.context
})

afterEach(async () => {
  // server = null
})

describe('Http Layer Test', async () => {
  it('Http layer is running successfully', async () => {
    return request(server)
      .get('/')
      .then((res) => {
        expect(res.body.data).to.have.property('message')
      })
  })

  it('Returns 404 on unsupported routes ', async () => {
    return request(server)
      .get('/me')
      .then((res) => {
        expect(res.statusCode).to.be.equal(404)
      })
  })
})
