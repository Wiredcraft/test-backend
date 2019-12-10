const express = require('express');
const routingController = require('../controllers/web_routing_controller');
const {createValidationRules, validateCreate} = require('../middleware/validator.js');

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
userWebRouter.get('/user/:userId', routingController.retrieveUser);

/**
 * @api {post} /enroll/   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userWebRouter.post('/user/enroll', createValidationRules(), webValidate, routingController.enrollUser);

/**
 * @api {post} /update   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userWebRouter.post('/user/update', routingController.updateUser);

/**
 * @api {post} /remove   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {String} message confirming the deletion.
 */
userWebRouter.post('/user/remove', routingController.deleteUser);
