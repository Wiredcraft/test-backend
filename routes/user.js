const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../param_validations/user');
const userCtrl = require('../controllers/user');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.create), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.read)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.update), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.delete);

module.exports = router;
