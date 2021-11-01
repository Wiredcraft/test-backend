const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router
.route('/register')
.post(userController.UserRegister);

router
.route('/login')
.post(userController.UserLogin);

router
.route('/:id')
.get(userController.getUser)


router
.route('/:username')
.patch(userController.UpdateUser)
.delete(userController.DeleteUser);

router
.route('/')
.get(userController.getAllUser);

module.exports = router;
