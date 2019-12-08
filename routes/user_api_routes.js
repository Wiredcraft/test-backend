const express = require('express');
const routingController = require('../controllers/routing_controller');

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
userAPIRouter.get('/list', routingController.getUsersList);

/**
 * @api {get} /user/:userId Request single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userAPIRouter.get('/user/:userId', routingController.retrieveUser);

/**
 * @api {post} /enroll   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userAPIRouter.post('/user/enroll', routingController.enrollUser);

/**
 * @api {post} /update   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userAPIRouter.post('/user/update', routingController.updateUser);

/**
 * @api {post} /remove   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {String} message confirming the deletion.
 */
userAPIRouter.post('/user/remove', routingController.deleteUser);
