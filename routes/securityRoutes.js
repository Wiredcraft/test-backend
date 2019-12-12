const express = require('express');
const passport = require('passport');
const {loginVR, registerVR,  webValidate} = require('../middleware/validator');
const droneController = require('../controllers/droneAccessController');
const securityController = require('../controllers/securityController');
const oauth2 = require('../config/oauth2')


const securityRouter = express.Router();
module.exports = securityRouter;


securityRouter.post('/login', loginVR(), webValidate, securityController.login);
securityRouter.get('/login',  securityController.signIn);
securityRouter.get('/', securityController.goHome);

securityRouter.post('/register', securityController.register);
securityRouter.get('/register', securityController.enroll);
