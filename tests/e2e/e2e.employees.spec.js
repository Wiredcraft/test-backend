process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const server = require('../../app')

describe('Employee Model Methods', () => {
  before(() => {
    // override the req.isAuthenticated() method
    server.request.isAuthenticated = function() {
      return true
    }
  })
  after(() => {
    // shutdown the server after all the tests finish running
    process.exit(0)
  })
  describe('GET /api/v1/employees/{employee_id}', () => {
    it('should return 404 if id not found', (done) => {
      chai.request(server)
        .get('/api/v1/employees/123')
        .end((err, res) => {
          // should error
          should.exist(err)
          // status code should be 404
          res.status.should.eql(404)
          // should return employee does not exist message
          res.body.message.should.eql('employee does not exist')
          done()
        })
    })

    it('should return employee if id found', (done) => {
      chai.request(server)
        .get('/api/v1/employees/5a71ce3bc69e07065f8b0249')
        .end((err, res) => {
          // should not error
          should.not.exist(err)
          // status code should be 200
          res.status.should.eql(200)
          // employee name should be Smith
          res.body.name.should.eql('Smith')
          done()
        })
    })
  })

  describe('GET /api/v1/employee/{username}', () => {
    it('should return 404 if username not found', (done) => {
      chai.request(server)
        .get('/api/v1/employee/musassa')
        .end((err, res) => {
          // should error
          should.exist(err)
          // status code should be 404
          res.status.should.eql(404)
          // should return employee does not exist message
          res.body.message.should.eql('employee does not exist')
          done()
        })
    })

    it('should return employee if username found', (done) => {
      chai.request(server)
        .get('/api/v1/employee/musa')
        .end((err, res) => {
          // should not error
          should.not.exist(err)
          // status code should be 200
          res.status.should.eql(200)
          done()
        })
    })
  })
})
