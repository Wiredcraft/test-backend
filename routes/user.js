const express = require('express');
const userController = require('../controllers/user');
const check = require('express-validator/check').check;
const router = express.Router();

// check params
const checkUserHandlers = [
  check('name').notEmpty().withMessage('can not empty'),
  check('dob').notEmpty().isDate({format: 'YYYY/MM/DD'}).withMessage('must be format YYYY/MM/DD'),
  check('address').notEmpty().withMessage('can not empty'),
];

router.get('/', userController.getUser);
router.put('/', checkUserHandlers, userController.addUser);
router.get('/:id', userController.getUser);
router.post('/:id', checkUserHandlers, userController.updateUser);
router.delete('/:id', userController.delUser);

module.exports = router;
