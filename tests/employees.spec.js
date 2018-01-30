process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const chaiSpies = require('chai-spies')
chai.use(chaiSpies)

// Base Url
const baseUrl = 'http://localhost:3000'

// import the server
const server = require('../app')

describe('Employees WithOut Mock', () => {
  describe('GET /api/v1/employees', () => {
    it('should get all employees', (done) => {
      chai.request(server)
      .get('/api/v1/employees')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err)
        // the status code should be 200
        res.status.should.eql(200)
        // there should be more than one employee
        res.body.length.should.not.eql(1)
        done()
      })
    })
  })

  describe('POST /api/v1/employee', () => {
    xit('should respond with a success message', (done) => {
      chai.request(server)
      .post('/api/v1/employee')
      .send({
        name: 'mack',
        dob: '12/12/1987',
        address: '409 classic street',
        description: 'good stuff',
        createdBy: 'mudu'
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err)
        // there should be a 201 status code
        // (indicating that something was "created")
        res.status.should.equal(201)
        done()
      })
    })
  })
})
