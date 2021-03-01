const logger = require('log4js').getLogger('UserController');
const UserRepository = require('../repositories/UserRepository');
const User = require('../models/User');
const USER_ALLOWED_INPUT_FIELDS = require('config').get(
  'User.USER_ALLOWED_INPUT_FIELDS');
const UserValidation = require('../validates/UserValidation');
const states = require('../constants/states');
const UserHandler = require('../handlers/UserHandler');

class UserController {

  /**
   * Controller for fetching all users.
   * @param {Object} req 
   * @param {Object} res 
   */

  static listAllUsers(req, res) {
    let errMsg = '';
    let msg = '';

    const { page, pageSize } = req.query;

    if ((page && !UserValidation.isPositiveInteger(page)) ||
      (pageSize && !UserValidation.isPositiveInteger(pageSize))) {
      errMsg = `The input page [${page}] or pageSize [${pageSize}] `;
      errMsg += `must be a positive integer.`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    logger.info(
      `Fetching user records with page [${page}] and pageSize [${pageSize}]...`);

    UserRepository.listAllUsers(page, pageSize)
      .then(data => {
        msg = `Successfully fetched ${data.length} user records.`;
        UserHandler.handlleUserSuccess(states.FETCHED, msg, res, data);
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * Controller for creating a new user.
   * @param {Object} req 
   * @param {Object} res 
   */

  static createUser(req, res) {
    let errMsg = '';
    let msg = '';

    const fields = req.body;

    logger.info(`The user input data is [${Object.entries(fields)}].`);

    // Validate the input fields and values.
    if (!UserValidation.areAllInputFieldsAllowed(fields)) {
      errMsg = `The allowed user fields are [${USER_ALLOWED_INPUT_FIELDS}].`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    if (UserValidation.isAnyRequiredFieldEmpty(fields)) {
      errMsg = `All required fields [${USER_ALLOWED_INPUT_FIELDS}] `;
      errMsg += `should not be empty.`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    if (!UserValidation.isValidDate(fields.dob)) {
      errMsg = `The input user birth date [${fields.dob}] `;
      errMsg += `should has format YYYY-MM-DD.`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    // Create the new user record.
    const user = new User(fields);
    logger.info(`Creating a new user record...`);
    UserRepository.createUser(user)
      .then(userId => {
        msg = `Successfully created a new user with id [${userId}].`;
        UserHandler.handlleUserSuccess(states.CREATED, msg, res);
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * Controller for fetching a single user record.
   * @param {Object} req 
   * @param {Object} res 
   */

  static findUserById(req, res) {
    let errMsg = '';
    let msg = '';

    const userId = req.params.userId;

    logger.info(`Searching for user record with id [${userId}]...`);

    UserRepository.findUserById(userId)
      .then(data => {
        if (data) {
          const user = new User(data);
          msg = `Found the target user ${user}.`;
          UserHandler.handlleUserSuccess(states.FETCHED, msg, res, user)
        } else {
          const errMsg = `The user record with id [${userId}] is not found.`;
          UserHandler.handleUserError(states.NOT_FOUND, errMsg, res);
        }
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * Controller for updating a user record.
   * @param {Object} req 
   * @param {Object} res 
   */

  static updateUser(req, res) {
    let errMsg = '';
    let msg = '';

    const userId = req.params.userId;
    const fields = req.body;

    logger.info(`The user input data is [${Object.entries(fields)}].`);

    // Validate the input fields and values.
    if (!UserValidation.areAllInputFieldsAllowed(fields)) {
      errMsg = `The allowed user fields are [${USER_ALLOWED_INPUT_FIELDS}].`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    if (UserValidation.areAllRequiredFieldsEmpty(fields)) {
      errMsg = `Must provide at least one field from `;
      errMsg += `[${USER_ALLOWED_INPUT_FIELDS}] to be updated.`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    // Check the format of dob if it is provided.
    if (fields.dob && !UserValidation.isValidDate(fields.dob)) {
      errMsg = `The user input birth date [${fields.dob}] should `;
      errMsg += `has format YYYY-MM-DD.`
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    logger.info(`Updating user record with id [${userId}]...`);

    UserRepository.updateUser(userId, fields)
      .then(success => {
        if (success) {
          msg = `Successfully updated user record with id [${userId}].`;
          UserHandler.handlleUserSuccess(states.UPDATED, msg, res);
        } else {
          errMsg = `Unable to find the user record with id [${userId}].`;
          UserHandler.handleUserError(states.NOT_FOUND, errMsg, res);
        }
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * Controller for deleting a user.
   * @param {Object} req 
   * @param {Object} res 
   */
  static deleteUser(req, res) {
    let errMsg = '';
    let msg = '';

    const userId = req.params.userId;

    logger.info(`Deleting user record with id [${userId}]...`);

    UserRepository.deleteUser(userId)
      .then(success => {
        if (success) {
          msg = `Successfully deleted user record with id [${userId}].`;
          UserHandler.handlleUserSuccess(states.DELETED, msg, res);
        } else {
          errMsg = `Unable to find the user record with id [${userId}].`;
          UserHandler.handleUserError(states.NOT_FOUND, errMsg, res);
        }
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

}

module.exports = UserController;
