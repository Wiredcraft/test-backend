const httpStatus = require('http-status');
const User = require('../models/user');
const APIError = require('../helpers/APIError');
const utils = require('../helpers/utils');

const UserController = {
  /**
  * @swagger
  * /users:
  *   post:
  *     tags:
  *       - Users
  *     description: Creates an user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: user
  *         description: User object
  *         in: body
  *         required: true
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  name:
  *                    type: string
  *                  dob:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                  password:
  *                    type: string
  *                    format: password
  *                required:
  *                  - username
  *                  - password
  *     responses:
  *       200:
  *         description: Successfully created
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  id:
  *                    type: string
  *                  name:
  *                    type: string
  *                  dob:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                  createdAt:
  *                    type: string
  *                    format: date-time
  */
  create(req, res, next) {
    User.create(req.body)
      .then(newUser => res.json(newUser))
      .catch(next);
  },
  /**
  * @swagger
  * /users/{userId}:
  *   get:
  *     tags:
  *       - Users
  *     description: Return the details of the user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: userId
  *         description: Users' id
  *         in: path
  *         required: true
  *         type: string
  *       - name: Authorization
  *         description: User's token
  *         in: header
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: The user
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  id:
  *                    type: string
  *                  name:
  *                    type: string
  *                  dob:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                  createdAt:
  *                    type: string
  *                    format: date-time
  */
  read(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, req.user, next);
    User.findOne({ _id: userId })
      .then((user) => {
        if (!user) {
          return next(new APIError(
            'Not Found',
            httpStatus.NOT_FOUND
          ));
        }
        return res.json(user);
      })
      .catch(next);
  },
  /**
  * @swagger
  * /users/me:
  *   get:
  *     tags:
  *       - Users
  *     description: Return the details of the user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: Authorization
  *         description: User's token
  *         in: header
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: The user
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  id:
  *                    type: string
  *                  name:
  *                    type: string
  *                  dob:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                  createdAt:
  *                    type: string
  *                    format: date-time
  */
  readMe(req, res) {
    return res.json(req.user);
  },
  /**
  * @swagger
  * /users/{userId}:
  *   put:
  *     tags:
  *       - Users
  *     description: Updates an user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: user
  *         description: User object
  *         in: body
  *         required: true
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  name:
  *                    type: string
  *                  dob:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                  password:
  *                    type: string
  *                    format: password
  *                required:
  *                  - username
  *                  - password
  *       - name: userId
  *         description: Users' id
  *         in: path
  *         required: true
  *         type: string
  *       - name: Authorization
  *         description: User's token
  *         in: header
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Successfully updated
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  id:
  *                    type: string
  *                  name:
  *                    type: string
  *                  dob:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                  createdAt:
  *                    type: string
  *                    format: date-time
  */
  update(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, req.user, next);
    User.findByIdAndUpdate({ _id: req.params.userId }, { $set: req.body }, { new: true })
      .then((user) => {
        if (!user) {
          return next(new APIError(
            'Not Found',
            httpStatus.NOT_FOUND
          ));
        }
        return res.json(user);
      })
      .catch(next);
  },
  /**
  * @swagger
  * /users/me:
  *   put:
  *     tags:
  *       - Users
  *     description: Updates an user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: user
  *         description: User object
  *         in: body
  *         required: true
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  name:
  *                    type: string
  *                  dob:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                  password:
  *                    type: string
  *                    format: password
  *                required:
  *                  - username
  *                  - password
  *       - name: Authorization
  *         description: User's token
  *         in: header
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Successfully updated
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  id:
  *                    type: string
  *                  name:
  *                    type: string
  *                  dob:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                  createdAt:
  *                    type: string
  *                    format: date-time
  */
  updateMe(req, res, next) {
    User.findByIdAndUpdate({ _id: req.user.id }, { $set: req.body }, { new: true })
      .then(user => res.json(user))
      .catch(next);
  },
  /**
  * @swagger
  * /users/{userId}:
  *   delete:
  *     tags:
  *       - Users
  *     description: Deletes an user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: userId
  *         description: Users' id
  *         in: path
  *         required: true
  *         type: string
  *       - name: Authorization
  *         description: User's token
  *         in: header
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Successfully deleted
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  id:
  *                    type: string
  *                  name:
  *                    type: string
  *                  dob:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                  createdAt:
  *                    type: string
  *                    format: date-time
  */
  delete(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, req.user, next);
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) => {
        if (!user) {
          return next(new APIError(
            'Not Found',
            httpStatus.NOT_FOUND
          ));
        }
        return res.json(user);
      })
      .catch(next);
  },
  /**
  * @swagger
  * /users/me:
  *   delete:
  *     tags:
  *       - Users
  *     description: Deletes an user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: Authorization
  *         description: User's token
  *         in: header
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Successfully deleted
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  id:
  *                    type: string
  *                  name:
  *                    type: string
  *                  dob:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                  createdAt:
  *                    type: string
  *                    format: date-time
  */
  deleteMe(req, res, next) {
    User.findOneAndRemove({ _id: req.user.id })
      .then(user => res.json(user))
      .catch(next);
  },
};

module.exports = UserController;
