process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const nock = require('nock')

// Base Url
const baseUrl = 'http://localhost:3000'

describe('Employees', () => {
  // create fake data
  const data = {
    headers: { 'content-type': 'application/json' },
    body: [
      { name: 'test1',
        dob: '12/12/1992',
        address: '200 five street',
        description: 'he is an amazing guy',
        createdBy: 'good dev',
        _id: '1' },
      { name: 'test2',
        dob: '12/12/1993',
        address: '201 mian road',
        description: 'he is really amazing',
        createdBy: 'nice dev',
        _id: '2'}
    ]
  }

  describe('GET /api/v1/employees', () => {
    it('should get all employees', (done) => {
      nock(baseUrl)
        .get('/api/v1/employees')
        .reply(200, data)

      chai.request(baseUrl)
        .get('/api/v1/employees')
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err)
          // the status code should be 200
          res.status.should.eql(200)
          // there should be two employees
          res.body.body.length.should.eql(2)
          done()
        })
    })
  })

  describe('POST /api/v1/employee', () => {
    it('should respond with employee created successfully', (done) => {
      nock(baseUrl)
        .post('/api/v1/employee', {
          name: 'test3',
          dob: '12/12/1995',
          address: '505 bay erea',
          description: 'he is really good',
          createdBy: 'amazing dev',
          _id: '3'
        })
        .reply(201, {message: 'Employee created successfully'})

      chai.request(baseUrl)
      .post('/api/v1/employee')
      .send({
        name: 'test3',
        dob: '12/12/1995',
        address: '505 bay erea',
        description: 'he is really good',
        createdBy: 'amazing dev',
        _id: '3'
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err)
        // there should be a 201 status code
        // (indicating that something was "created")
        res.status.should.equal(201)
        // there should be a success message
        res.body.message.should.eql('Employee created successfully')
        done()
      })
    })
  })

  describe('PUT /api/v1/employee_id', () => {
    it('should responed with Employee updated successfully', (done) => {
      nock(baseUrl)
        .put('/api/v1/1', {
          address: '4099 SF bey area'
        })
        .reply(200, {message: 'Employee updated successfully'})

      chai.request(baseUrl)
        .put('/api/v1/1')
        .send({address: '4099 SF bey area'})
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err)
          // there should be a 201 status code
          // (indicating that something was "updated")
          res.status.should.eql(200)
          // there should be a success message
          res.body.message.should.eql('Employee updated successfully')
          done()
        })
    })
  })

  describe('DELETE /api/v1/employee_id', () => {
    it('should responed with Employee deleted successfully', (done) => {
      nock(baseUrl)
        .delete('/api/v1/2')
        .reply(204, {message: 'Employee deleted successfully'})

      chai.request(baseUrl)
        .delete('/api/v1/2')
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err)
          // there should be a 201 status code
          // (indicating that something was "deleted")
          res.status.should.eql(204)
          // there should be a success message
          res.body.message.should.eql('Employee deleted successfully')
          done()
        })
    })
  })
})
