const express = require('express');
const router = express.Router();
const User = require('../models/user')


/* GET all users. */
router.get('/users', (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.send(err)
    }
    // everything good, return users
    res.json(users)
  })
})

/* GET user by id */
router.get('/:user_id', (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.send(err)
    }
    // everything good, return user
    res.json(user)
  })
})

/* GET user by username */
router.get('/users/:username', (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.send(err)
    }
    // everything good, find and return the user
    const user = users.filter(user => user.name === req.params.username)
    res.json(user)
  })
})

/* Create user */
router.post('/user', (req, res) => {
  // instantiate the model
  const user = new User()
  // get the user (coming from the request)
  user.name = req.body.name
  user.dob = req.body.dob
  user.address = req.body.address
  user.description = req.body.description

  // save the data received
  user.save((err) => {
    if (err) {
      res.send(err)
    }
    // everything good, send success message
    res.json({message: 'User created successfully'})
  })
})

/* Update user */
router.put('/:user_id', (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.send(err)
    }
    // everything good, update user
    user.name = req.body.name
    user.dob = req.body.dob
    user.address = req.body.address
    user.description = req.body.description

    // save the new data
    user.save((err) => {
      if (err) {
        res.send(err)
      }
      // everything good, send success message
      res.json({message: 'User updated successfully'})
    })
  })
})

// Delete user by id
router.delete('/:user_id', (req, res) => {
  User.remove({_id: req.params.user_id}, (err, user) => {
    if (err) {
      res.send(err)
    }
    // everything good, send success message
    res.json({message: 'User deleted successfully'})
  })
})

module.exports = router;
