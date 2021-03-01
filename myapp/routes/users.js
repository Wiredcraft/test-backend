const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const paramStr = '/:userId';

// Currently we don't support calling different version of the api, all
// the api users should call the same version of the api. Calling different
// versions of the user api will be supported here in the future.
router
  .get('/', UserController.listAllUsers)
  .post('/', UserController.createUser);

router
  .get(paramStr, UserController.findUserById)
  .put(paramStr, UserController.updateUser)
  .delete(paramStr, UserController.deleteUser);

module.exports = router;
