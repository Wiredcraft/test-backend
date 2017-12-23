const express = require('express');

const router = express.Router();

// Expose User model
const User = require('../../models/user');

// APIs actions
User.methods(['get', 'post', 'put', 'delete']);
User.register(router, '/users');

module.exports = router;
