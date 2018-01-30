process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const nock = require('nock')

// Base Url
const baseUrl = 'http://localhost:3000'

describe('Users', () => {
  /* test login */
  describe('Login /api/auth', () => {
    it('should respond with "good work keep on hacking"', (done) => {
      nock(baseUrl)
        .get('/api/auth')
        .reply(200, {message: 'good work keep on hacking'})

      chai.request(baseUrl)
        .get('/api/auth')
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err)
          // the status code should be 200
          res.status.should.eql(200)
          // there should be a success message
          res.body.message.should.eql('good work keep on hacking')
          done()
        })
    })
  })

  describe('Logout /api/auth/logout', () => {
    it('should respond with no content', (done) => {
      nock(baseUrl)
        .get('/api/auth/logout')
        .reply(204)

      chai.request(baseUrl)
        .get('/api/auth/logout')
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err)
          // the status code should be 204
          res.status.should.eql(204)
          done()
        })
    })
  })
})
