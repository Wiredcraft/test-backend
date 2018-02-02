const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../param_validations/user');
const userCtrl = require('../controllers/user');
const middlewares = require('../helpers/middlewares');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.create), userCtrl.create);

router.route('/me')
  .get(middlewares.authenticate, userCtrl.readMe)
  /** PUT /api/users/:userId - Update user */
  .put(middlewares.authenticate, validate(paramValidation.update), userCtrl.updateMe)

  /** DELETE /api/users/:userId - Delete user */
  .delete(middlewares.authenticate, userCtrl.deleteMe);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(middlewares.authenticate, userCtrl.read)

  /** PUT /api/users/:userId - Update user */
  .put(middlewares.authenticate, validate(paramValidation.update), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(middlewares.authenticate, userCtrl.delete);

module.exports = router;
