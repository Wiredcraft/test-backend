const express = require('express');
const router = express.Router();
const Employee = require('../models/employee')

/* The authorization middleware */
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  // if not logged in return 401 error
  res.status(401).send({message: 'Unauthorized'})
}


/* GET all employees. */
router.get('/employees', isLoggedIn, (req, res) => {
  Employee.find((err, employees) => {
    if (err) {
      res.send(err)
    }
    // everything good, return employees
    res.json(employees)
  })
})

/* GET employee by id */
router.get('/:employee_id', isLoggedIn, (req, res) => {
  Employee.findById(req.params.employee_id, (err, employee) => {
    if (err) {
      res.send(err)
    }
    // everything good, return employee
    res.json(employee)
  })
})

/* GET employee by username */
router.get('/employees/:username', isLoggedIn, (req, res) => {
  Employee.find((err, employees) => {
    if (err) {
      res.send(err)
    }
    // everything good, find and return the employee
    const employee = employees.filter(employee => employee.name === req.params.username)
    res.json(employee)
  })
})

/* Create employee */
router.post('/employee', isLoggedIn, (req, res) => {
  // instantiate the model
  const employee = new Employee()
  // get the employee (coming from the request)
  employee.name = req.body.name
  employee.dob = req.body.dob
  employee.address = req.body.address
  employee.description = req.body.description
  employee.createdBy = req.user.username

  // save the data received
  employee.save((err) => {
    if (err) {
      res.send(err)
    }
    // everything good, send success message
    res.json({message: 'Employee created successfully'})
  })
})

/* Update employee */
router.put('/:employee_id', isLoggedIn, (req, res) => {
  Employee.findById(req.params.employee_id, (err, employee) => {
    if (err) {
      res.send(err)
    }
    // everything good, update employee
    employee.name = req.body.name
    employee.dob = req.body.dob
    employee.address = req.body.address
    employee.description = req.body.description
    employee.createdBy = req.user.username

    // save the new data
    employee.save((err) => {
      if (err) {
        res.send(err)
      }
      // everything good, send success message
      res.json({message: 'Employee updated successfully'})
    })
  })
})

// Delete employee by id
router.delete('/:employee_id', isLoggedIn, (req, res) => {
  Employee.remove({_id: req.params.employee_id}, (err, employee) => {
    if (err) {
      res.send(err)
    }
    // everything good, send success message
    res.json({message: 'Employee deleted successfully'})
  })
})

module.exports = router;
