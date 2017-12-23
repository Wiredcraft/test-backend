'use strict'

const express = require('express')
const router = express.Router()

var User = require('../../models/user')

// APIs actions
User.methods(['get', 'post', 'put', 'delete']);
User.register(router, '/users')

module.exports = router;
