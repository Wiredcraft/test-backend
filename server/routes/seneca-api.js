/* import the employee model */
const Employee = require('../models/employee')

/* export the seneca api */
module.exports = function (options) {
  /* register get pattern */
  this.add('role:api,path:employees', (msg, done) => {
    this.act('role:employees', {
      cmd: 'getEmployees'
    }, (err, res) => {
      Employee.find((err, employees) => {
        if (err) {done(err)}
        done(employees)
      })
    })
  })

  /* register the initialization pattern */
  this.add('init:api', (msg, respond) => {
    this.act('role:web', {routes: {
      prefix: '/api/v1',
      pin: 'role:api,path:*',
      map: {
        employees: { GET:true }
      }
    }}, respond)
  })
}
