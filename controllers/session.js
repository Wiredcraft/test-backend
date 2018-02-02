const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const APIError = require('../helpers/APIError');
const config = require('../config');

const SessionController = {
  /**
  * @swagger
  * /sessions:
  *   post:
  *     tags:
  *       - Sessions
  *     description: Authenticate a user
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
  *                  username:
  *                    type: string
  *                  password:
  *                    type: string
  *                required:
  *                  - username
  *                  - password
  *     responses:
  *       200:
  *         description: Successfully Authenticated
  *         schema:
  *           properties:
  *             token:
  *               type: string
  */
  create(req, res, next) {
    User.findOne({
      username: req.body.username,
    })
      .then((user) => {
        if (!user) {
          console.log('***************is it here?');
          const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
          return next(err);
        }
        if (!user.authenticate(req.body.password)) {
          console.log('***************or here?');
          const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
          return next(err);
        }
        const token = jwt.sign(
          { id: user.id, username: user.username },
          config.jwtSecret
        );

        return res.json({
          token,
        });
      })
      .catch(next);
  }
};

module.exports = SessionController;
