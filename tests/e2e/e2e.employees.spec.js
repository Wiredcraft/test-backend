process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const server = require('../../app')

describe('Employees', () => {
  // keep _id and username
  const identiFies = []
  before(() => {
    // override the req.isAuthenticated() method
    // to be able to pass the api endpoints for testing
    server.request.isAuthenticated = () => true
    // attache a user to the request
    // for the createdBy field
    server.request.user = {
      username: 'Ousmane',
      googleId: '105206227399726461643'
    }
  })
  after(() => {
    // shutdown the server after all the tests finish running
    process.exit(0)
  })

  describe('POST /api/v1/employees', () => {
    // helper function to generate random strings
    const appendString = (size = 2, charset = 'abcdefghijklmnopqrstuvwxyz') => {
      let res = ''
      while (size--) res += charset[Math.random() * charset.length | 0]
      return res
    }

    it('should return new employee', (done) => {
      chai.request(server)
        .post('/api/v1/employees')
        .send({
          name: 'musa musa',
          username: 'musa' + appendString(), // for making username unique
          dob: '02/02/2010',
          address: '3388 good road',
          description: 'amazing person'
        })
        .end((err, res) => {
          // should not error
          should.not.exist(err)
          // status code should be 201
          res.status.should.eql(201)
          // employee name should equal to musa musa
          res.body.name.should.eql('musa musa')
          // store the username and _id
          identiFies.push(
            {username: res.body.username},
            {_id: res.body._id}
          )
          done()
        })
    })

    it('should return 409 for duplicates', (done) => {
      chai.request(server)
        .post('/api/v1/employees')
        .send({
          name: 'musa musa',
          username: `${identiFies[0].username}`,
          dob: '02/02/2010',
          address: '3388 good road',
          description: 'amazing person'
        })
        .end((err, res) => {
          // should error
          should.exist(err)
          // status code should be 409
          res.status.should.eql(409)
          done()
        })
    })
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
        .get(`/api/v1/employees/${identiFies[1]._id}`)
        .end((err, res) => {
          // should not error
          should.not.exist(err)
          // status code should be 200
          res.status.should.eql(200)
          // employee username should be musagj
          res.body.username.should.eql(`${identiFies[0].username}`)
          done()
        })
    })
  })

  describe('GET /api/v1/employee/{username}', () => {
    it('should return 404 if username not found', (done) => {
      chai.request(server)
        .get('/api/v1/employee/musassaldld')
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

    it('should return 200 if username found', (done) => {
      chai.request(server)
        .get(`/api/v1/employee/${identiFies[0].username}`)
        .end((err, res) => {
          // should not error
          should.not.exist(err)
          // status code should be 200
          res.status.should.eql(200)
          done()
        })
    })
  })

  describe('PUT /api/v1/employees/{employee_id}', () => {
    it('should return 200 if update successfully', (done) => {
      chai.request(server)
        .put(`/api/v1/employees/${identiFies[1]._id}`)
        .send({
          name: 'John Doe',
          username: `${identiFies[0].username}`,
          dob: '02/02/1990',
          address: '3388 bay area',
          description: 'Awesome guy'
        })
        .end((err, res) => {
          // should not error
          should.not.exist(err)
          // status code should be 200
          res.status.should.eql(200)
          done()
        })
    })
  })

  describe('DELETE /api/v1/employees/{employee_id}', () => {
    it('should return 204 if delete successfully', () => {
      chai.request(server)
        .delete(`/api/v1/employees/${identiFies[1]._id}`)
        .end((err, res) => {
          // should not error
          should.not.exist(err)
          // status code should be 204
          res.status.should.eql(204)
          done()
        })
    })
  })
})
