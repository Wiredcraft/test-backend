const express = require('express');
const routingController = require('../controllers/api_routing_controller');

const validator = require('../middleware/validator.js');
const createValidationRules = validator.createValidationRules;
const retrieveValidationRules = validator.retrieveValidationRules;
const deleteValidationRules = validator.deleteValidationRules;
const changeValidationRules = validator.changeValidationRules;
const apiValidate = validator.apiValidate;

const converter = require('../middleware/handleId.js').convertId;

const userAPIRouter = express.Router();
module.exports = userAPIRouter;

/**
 * @api {get} /list Request list of users
 * @apiName ListUsers
 *
 * @apiParam None
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userAPIRouter.get('/user/list', routingController.getUsersList);

/**
 * @api {get} /user/:userId Request single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userAPIRouter.get('/user/:userId', retrieveValidationRules(), apiValidate, routingController.retrieveUser);

/**
 * @api {post} /enroll   single user
 * @apiName EnrollUser
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 **/
userAPIRouter.post('/user/enroll', converter, createValidationRules(), apiValidate, routingController.enrollUser);

/**
 * @api {post} /update  single user
 * @apiName UpdateUser
 *
 * @apiParam {String} userId User's unique ID and fields to be updated
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userAPIRouter.post('/user/update', converter, changeValidationRules(), apiValidate, routingController.updateUser);

/**
 * @api {post} /remove   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {String} message confirming the deletion.
 */
userAPIRouter.post('/user/remove', converter, deleteValidationRules(), apiValidate, routingController.deleteUser);
