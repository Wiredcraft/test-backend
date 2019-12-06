const express = require('express');
const routingController = require('../controllers/routing_controller');

const userAPIRouter = express.Router();
module.exports = userAPIRouter;

/**
 * @api {get} /list Request User information
 * @apiName ListUsers
 *
 * @apiParam None
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userAPIRouter.get('/list', routingController.getUsersList);

