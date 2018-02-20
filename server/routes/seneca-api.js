/* imports */
const express = require('express')
const Employee = require('../models/employee')

/* export the seneca api */
module.exports = function (options) {
  // add the router to the plugin
  this.router = express.Router()
  /* register get pattern */
  this.add('role:api,path:employees', (msg, done) => {
    this.router.get('/api/seneca/employees', (req, res, next) => {
      this.act('role:employees', {
        cmd: 'getEmployees'
      }, (err, response) => {
        if (err) {return next(err)}
        Employee.find((err, employees) => {
          if (err) {
            res.send(err)
          }
          // everything good, return employees
          res.json(employees)
        })
      })
    })
  })

  /* register the initialization pattern */
  this.add('init:api', (msg, respond) => {
    this.act('role:web', {routes: {
      prefix: '/api/seneca',
      pin: 'role:api,path:*',
      map: {
        employees: { GET:true }
      }
    }}, respond)
  })
}
