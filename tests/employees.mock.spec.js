process.env.NODE_ENV = 'test'

const router = require('express').Router()
const sinon = require('sinon')
const chai = require('chai')
const should = chai.should()

// Base Url
const baseUrl = 'http://localhost:3000'

describe('Employees Mock', () => {
  // define the mock data for get
  const getResponse = {
    status: 200,
    headers: {
      'content-type': 'application/json'
    },
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

  const postResponse = {
    status: 201,
    headers: {
      'content-type': 'application/json'
    },
    body: [
      { name: 'test3',
        dob: '12/12/1995',
        address: '505 bay erea',
        description: 'he is really good',
        createdBy: 'amazing dev',
        _id: '3'}
    ]
  }

  beforeEach(() => {
    this.get = sinon.stub(router, 'get')
    this.post = sinon.stub(router, 'post')
  })
  afterEach(() => {
    router.get.restore()
    router.post.restore()
  })
  describe('GET /api/v1/employees', () => {
    it('should get all employees', (done) => {
      this.get.yields(null, getResponse)
      router.get(`${baseUrl}/api/v1/employees`, (err, res) => {
        // the status code should be 200
        res.status.should.eql(200)
        // the response should be json
        res.headers['content-type'].should.contain('application/json')
        // there should be two employees
        res.body.length.should.eql(2)
        // the employee name should be test1
        res.body[0].name.should.eql('test1')
        done()
      })
    })
  })

  describe('POST /api/v1/employee', () => {
    it('should create employee', (done) => {
      this.post.yields(null, postResponse)
      router.post(`${baseUrl}/api/v1/employee`, (err, res) => {
        // the status code should be 201
        res.status.should.eql(201)
        // the employee name should be test3
        res.body[0].name.should.eql('test3')
        done()
      })
    })
  })
})
