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
      res.status(404).send(err)
    }
    if (employees.length < 1) {
      res.status(200).send({message: "you don't have any employees yet"})
    } else {
      // everything good, return employees
      res.status(200).json(employees)
    }
  })
})

/* GET employee by id */
router.get('/employees/:employee_id', isLoggedIn, (req, res) => {
  Employee.findById(req.params.employee_id, (err, employee) => {
    if (err) {
      res.status(404).send({message: "employee does not exist"})
    }
    // everything good, return employee
    res.status(200).json(employee)
  })
})

/* GET employee by username */
router.get('/employee/:username', isLoggedIn, (req, res) => {
  Employee.find((err, employees) => {
    if (err) {
      res.status(404).send(err)
    }
    // find employee with provided username
    const employee = employees.filter(employee => employee.username === req.params.username)
    if (employee.length < 1) {
      res.status(404).send({message: 'employee does not exist'})
    } else {
      // everything good, return the employee
      res.json(employee)
    }
  })
})

/* Create employee */
router.post('/employees', isLoggedIn, (req, res) => {
  // instantiate the model
  const employee = new Employee()
  // get the employee (coming from the request)
  employee.name = req.body.name
  employee.username = req.body.username
  employee.dob = req.body.dob
  employee.address = req.body.address
  employee.description = req.body.description
  employee.createdBy = req.user.username

  // save the data received
  employee.save((err) => {
    if (err) {
      if (err.code === 11000) {
        res.status(409).send({message: err.errmsg})
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({message: err.message})
      }
    } else {
      // everything good, return created employee
      res.status(201).json(employee)
    }
  })
})

/* Update employee */
router.put('/employees/:employee_id', isLoggedIn, (req, res) => {
  Employee.findById(req.params.employee_id, (err, employee) => {
    if (err) {
      res.status(404).send({message: 'employee does not exist'})
    } else {
      // everything good, update employee
      employee.name = req.body.name
      employee.username = req.body.username
      employee.dob = req.body.dob
      employee.address = req.body.address
      employee.description = req.body.description
      employee.createdBy = req.user.username

      // save the new data
      employee.save((err) => {
        if (err) {
          res.send(err)
        }
        // everything good, return updated employee
        res.status(200).json(employee)
      })
    }
  })
})

// Delete employee by id
router.delete('/employees/:employee_id', isLoggedIn, (req, res) => {
  Employee.remove({_id: req.params.employee_id}, (err, employee) => {
    if (err) {
      res.status(404).send({message: 'employee does not exist'})
    } else {
      // everything good, send success message
      res.status(204).send({message: 'Employee deleted successfully'})
    }
  })
})

module.exports = router;
