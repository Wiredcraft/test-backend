const express = require('express');
const validate = require('express-validation');
const userRoutes = require('./user');
const sessionRoutes = require('./session');

const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.use('/sessions', sessionRoutes);

router.use('/users', userRoutes);

module.exports = router;
