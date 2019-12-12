const express = require('express');
const passport = require('passport');
const routingController = require('../controllers/apiRoutingController');

const validator = require('../middleware/validator.js');
const createVR = validator.createVR;
const retrieveVR = validator.retrieveVR;
const deleteVR = validator.deleteVR;
const changeVR = validator.changeVR;
const apiValidate = validator.apiValidate;

const converter = require('../middleware/handleId.js').convertId;

const userAPIRouter = express.Router();
module.exports = userAPIRouter;

userAPIRouter.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {
    res.json({
        msg: 'API is running'
    });
});

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
userAPIRouter.get('/user/:userId', retrieveVR(), apiValidate, routingController.retrieveUser);

/**
 * @api {post} /enroll   single user
 * @apiName EnrollUser
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {JSON object} JSON object of users.
 **/
userAPIRouter.post('/user/enroll', converter, createVR(), apiValidate, routingController.enrollUser);

/**
 * @api {post} /update  single user
 * @apiName UpdateUser
 *
 * @apiParam {String} userId User's unique ID and fields to be updated
 *
 * @apiSuccess {JSON object} JSON object of users.
 */
userAPIRouter.post('/user/update', converter, changeVR(), apiValidate, routingController.updateUser);

/**
 * @api {post} /remove   single user
 * @apiName GetUserById
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {String} message confirming the deletion.
 */
userAPIRouter.post('/user/remove', converter, deleteVR(), apiValidate, routingController.deleteUser);
