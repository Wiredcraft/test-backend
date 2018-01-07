const express = require('express');

const router = express.Router();

// Expose User model
const User = require('../../../models/user');

// User service
const UserService = require('./service');

// APIs actions
User.methods(['get', 'post', 'put', 'delete']);

// Login API
function login(req, res) {
  User.findOne({
    name: req.body.name,
  }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
    } else if (user) {
      UserService.validatePassword(user, req.body.password, res);
    }
  });
}

User.route('login.post', login);

// APIs hooks

// Authenticate API token
function authenticateToken(req, res, next) {
  // Get access token from header, url or post body
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    UserService.verifyToken(res, token, next);
  } else {
    res.status(401).json({ success: false, message: 'missing authorization header' });
  }
}

User.before('get', authenticateToken)
  .before('put', authenticateToken)
  .before('delete', authenticateToken);

// Remove password field for any action
function removePassword(req, res, next) {
  if (res.locals.status_code === 200 || res.locals.status_code === 201) {
    res = UserService.removePassword(res);
  }
  next();
}

User.after('get', removePassword)
  .after('post', removePassword)
  .after('put', removePassword);

// Register User routes
User.register(router, '/users');

module.exports = router;
