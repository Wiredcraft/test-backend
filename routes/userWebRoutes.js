const express = require('express');
const routingController = require('../controllers/webRoutingController');
const validator = require('../middleware/validator.js');
const createVR = validator.createVR;
const retrieveVR = validator.retrieveVR;
const updateVR = validator.updateVR;
const deleteVR = validator.deleteVR;
const webValidate = validator.webValidate;
const converter = require('../middleware/handleId.js').convertId;

const userWebRouter = express.Router();
module.exports = userWebRouter;


/**
 * @api {get} /list Request list of users
 * @apiName ListUsers
 *
 * @apiParam None
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userWebRouter.get('/user/list', routingController.getUsersList);

/**
 * @api {get} /user/:userId Request single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userWebRouter.get('/user/:userId', converter, retrieveVR(), webValidate, routingController.retrieveUser);

/**
 * @api {post} /enroll/   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userWebRouter.post('/user/enroll', converter, createVR(), webValidate, routingController.enrollUser);

/**
 * @api {post} /update   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userWebRouter.post('/user/update', converter,  updateVR(), webValidate, routingController.updateUser);

/**
 * @api {post} /remove   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {String} message confirming the deletion.
 */
userWebRouter.post('/user/remove', converter, deleteVR(), webValidate, routingController.deleteUser);
