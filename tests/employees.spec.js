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
        username: 'user1',
        dob: '12/12/1992',
        address: '200 five street',
        description: 'he is an amazing guy',
        createdBy: 'good dev',
        _id: '1' },
      { name: 'test2',
        username: 'user2',
        dob: '12/12/1993',
        address: '201 mian road',
        description: 'he is really amazing',
        createdBy: 'nice dev',
        _id: '2'}
    ]
  }

  describe('GET /api/v1/employees', () => {
    it('should return a "401" if not authenticated', (done) => {
      nock(baseUrl)
        .get('/api/v1/employees')
        .reply(function(uri, requestBody) {
          if (!this.req.headers.authenticated) {
            return [
              401,
              {message: 'Unauthorized'}
            ]
          }
        })

      chai.request(baseUrl)
        .get('/api/v1/employees')
        .end((err, res) => {
          // there should an error
          should.exist(err)
          // status code should be 401
          res.status.should.eql(401)
          // it should be a client error
          res.clientError.should.eql(true)
          res.serverError.should.eql(false)
          done()
        })
    })
    it('should get all employees if authenticated', (done) => {
      nock(baseUrl)
        .get('/api/v1/employees')
        .reply(function(uri, requestBody) {
          if (this.req.headers.authenticated) {
            return [
              200,
              data
            ]
          }
        })

      chai.request(baseUrl)
        .get('/api/v1/employees')
        .set('authenticated', 'true')
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

  describe('POST /api/v1/employees', () => {
    it('should return a "401" if not authenticated', (done) => {
      nock(baseUrl)
        .get('/api/v1/employees')
        .reply(function(uri, requestBody) {
          if (!this.req.headers.authenticated) {
            return [
              401,
              {message: 'Unauthorized'}
            ]
          }
        })

      chai.request(baseUrl)
        .get('/api/v1/employees')
        .end((err, res) => {
          // there should an error
          should.exist(err)
          // status code should be 401
          res.status.should.eql(401)
          // it should be a client error
          res.clientError.should.eql(true)
          res.serverError.should.eql(false)
          done()
        })
    })
    it('should respond with created employee if authenticated', (done) => {
      nock(baseUrl)
        .post('/api/v1/employees')
        .reply(function(uri, requestBody) {
          if (this.req.headers.authenticated) {
            return [
              201,
              {
                name: 'test3',
                username: 'user3',
                dob: '12/12/1995',
                address: '505 bay erea',
                description: 'he is really good',
                createdBy: 'amazing dev',
                _id: '3'
              }
            ]
          }
        })

      chai.request(baseUrl)
      .post('/api/v1/employees')
      .set('authenticated', 'true')
      .send({
        name: 'test3',
        username: 'user3',
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
        res.body.name.should.eql('test3')
        done()
      })
    })
  })

  describe('PUT /api/v1/employees/{employee_id}', () => {
    it('should return a "401" if not authenticated', (done) => {
      nock(baseUrl)
        .put('/api/v1/employees/1')
        .reply(function(uri, requestBody) {
          if (!this.req.headers.authenticated) {
            return [
              401,
              {message: 'Unauthorized'}
            ]
          }
        })

      chai.request(baseUrl)
        .put('/api/v1/employees/1')
        .end((err, res) => {
          // there should an error
          should.exist(err)
          // status code should be 401
          res.status.should.eql(401)
          // it should be a client error
          res.clientError.should.eql(true)
          res.serverError.should.eql(false)
          done()
        })
    })
    it('should responed with updated employee if authenticated', (done) => {
      nock(baseUrl)
        .put('/api/v1/employees/1')
        .reply(function(uri, requestBody) {
          if (this.req.headers.authenticated) {
            return [
              200,
              {
                name: 'test1',
                username: 'user1',
                dob: '12/12/1992',
                address: '4034 bay area',
                description: 'he is an amazing guy',
                createdBy: 'good dev',
                _id: '1'
              }
            ]
          }
        })

      chai.request(baseUrl)
        .put('/api/v1/employees/1')
        .set('authenticated', 'true')
        .send({
          name: 'test1',
          username: 'user1',
          dob: '12/12/1992',
          address: '4034 bay area',
          description: 'he is an amazing guy',
          createdBy: 'good dev',
          _id: '1'
        })
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err)
          // there should be a 201 status code
          // (indicating that something was "updated")
          res.status.should.eql(200)
          // there should be a success message
          res.body.address.should.eql('4034 bay area')
          done()
        })
    })
  })

  describe('DELETE /api/v1/employees/{employee_id}', () => {
    it('should return a "401" if not authenticated', (done) => {
      nock(baseUrl)
        .get('/api/v1/employees/2')
        .reply(function(uri, requestBody) {
          if (!this.req.headers.authenticated) {
            return [
              401,
              {message: 'Unauthorized'}
            ]
          }
        })

      chai.request(baseUrl)
        .get('/api/v1/employees/2')
        .end((err, res) => {
          // there should an error
          should.exist(err)
          // status code should be 401
          res.status.should.eql(401)
          // it should be a client error
          res.clientError.should.eql(true)
          res.serverError.should.eql(false)
          done()
        })
    })
    it('should responed with Employee deleted successfully if authenticated', (done) => {
      nock(baseUrl)
        .delete('/api/v1/employees/2')
        .reply(function(uri, requestBody) {
          if (this.req.headers.authenticated) {
            return [
              204,
              {message: 'Employee deleted successfully'}
            ]
          }
        })

      chai.request(baseUrl)
        .delete('/api/v1/employees/2')
        .set('authenticated', 'true')
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
