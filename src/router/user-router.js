const express = require('express');
const router = express.Router();
const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controller/user-controller');
const { reply } = require('../service/middlewares');

router.get('/', reply(getUser));
router.post('/', reply(createUser));
router.patch('/', reply(updateUser));
router.delete('/', reply(deleteUser));

module.exports = router

