const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../param_validations/user');
const sessionCtrl = require('../controllers/session');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/session - login */
  .post(validate(paramValidation.create), sessionCtrl.create);

module.exports = router;
