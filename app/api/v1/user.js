const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();
const passwordStars = 'xxxxxxxxxxxx';

// Expose User model
const User = require('../../models/user');

// APIs actions
User.methods(['get', 'post', 'put', 'delete']);

// Login API

function login(req, res) {
  User.findOne({
    name: req.body.name,
  }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.json({ success: false, message: 'User not found' });
    } else if (user) {
      user.isValidPassword(req.body.password).then((isValid) => {
        if (isValid) {
          // generate api token that will be expired in 24 hours
          const token = jwt.sign({ user: user.name }, config.get('secret'), {
            expiresIn: '24h',
          });
          res.json({
            success: true,
            token,
          });
        } else {
          res.json({ success: false, message: 'Wrong password' });
        }
      });
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
    jwt.verify(token, config.get('secret'), (err) => {
      if (err) {
        res.status(401).json({ success: false, message: 'invalid token' });
      }
      // valid token
      next();
    });
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
    if (Array.isArray(res.locals.bundle)) {
      res.locals.bundle = res.locals.bundle.map((user) => {
        user.password = `${passwordStars}`;
        return user;
      });
    } else {
      res.locals.bundle.password = `${passwordStars}`;
    }
  }
  next();
}

User.after('get', removePassword)
  .after('post', removePassword)
  .after('put', removePassword);

// Register User routes
User.register(router, '/users');

module.exports = router;
