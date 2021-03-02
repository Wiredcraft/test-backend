const logger = require('log4js').getLogger('UserController');
const UserRepository = require('../repositories/UserRepository');
const User = require('../models/User');
const USER_ALLOWED_INPUT_FIELDS = require('config').get(
  'User.USER_ALLOWED_INPUT_FIELDS');
const UserValidation = require('../validates/UserValidation');
const states = require('../constants/states');
const UserHandler = require('../handlers/UserHandler');
const Address = require('../models/Address');

class UserController {

  /**
   * Make the user with userId following the user with otherUserId.
   * @param {Object} req 
   * @param {Object} res 
   */

  static createFollowing(req, res) {
    let errMsg = '';
    let msg = '';

    const { userId, otherUserId } = req.params;

    logger.info(
      `User [${userId}] is going to follow User [${otherUserId}]...`);

    UserRepository.createFollowing(userId, otherUserId)
      .then(([myUserExists, otherUserExists]) => {
        if (!myUserExists && !otherUserExists) {
          errMsg = `Both follower [${userId}] and `;
          errMsg += `following users [${otherUserId}] are not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else if (!myUserExists) {
          errMsg = `Follower user [${userId}] is not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else if (!otherUserExists) {
          errMsg = `Following user [${otherUserId}] is not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else {
          msg = `User [${userId}] is following User [${otherUserId}] now.`;
          UserHandler.handlleUserSuccess(states.CREATED, msg, res);
        }
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * Make the user with userId not following the user with otherUserId.
   * @param {Object} req 
   * @param {Object} res 
   */

  static deleteFollowing(req, res) {
    let errMsg = '';
    let msg = '';

    const { userId, otherUserId } = req.params;

    logger.info(
      `User [${userId}] is going to unfollow User [${otherUserId}]...`);

    UserRepository.deleteFollowing(userId, otherUserId)
      .then(([myUserExists, otherUserExists]) => {
        if (!myUserExists && !otherUserExists) {
          errMsg = `Both follower [${userId}] and `;
          errMsg += `following users [${otherUserId}] are not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else if (!myUserExists) {
          errMsg = `Follower user [${userId}] is not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else if (!otherUserExists) {
          errMsg = `Following user [${otherUserId}] is not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else {
          msg = `User [${userId}] is not following User [${otherUserId}] now.`;
          UserHandler.handlleUserSuccess(states.DELETED, msg, res);
        }
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * List all the followings the user with userId has.
   * @param {Object} req 
   * @param {Object} res 
   */

  static listAllFollowings(req, res) {
    let errMsg = '';
    let msg = '';

    const userId = req.params.userId;
    const { page, pageSize } = req.query;

    if ((page && !UserValidation.isPositiveInteger(page)) ||
      (pageSize && !UserValidation.isPositiveInteger(pageSize))) {
      errMsg = `The input page [${page}] or pageSize [${pageSize}] `;
      errMsg += `must be a positive integer.`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    logger.info(`Fetching followings records for user id [${userId}]` +
      ` with page [${page}] and pageSize [${pageSize}]...`);

    UserRepository.listAllFollowings(userId, page, pageSize)
      .then(users => {
        msg = `Successfully fetched ${users.length} user records.`;
        UserHandler.handlleUserSuccess(states.FETCHED, msg, res, users);
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * Check if the user with userId is following the user with otherUserId.
   * @param {Object} req 
   * @param {Object} res 
   */

  static FindFollowingById(req, res) {
    let errMsg = '';
    let msg = '';

    const { userId, otherUserId } = req.params;

    logger.info(
      `Checking if User [${userId}] is following User [${otherUserId}]...`);

    UserRepository.FindFollowingById(userId, otherUserId)
      .then(exists => {
        if (exists) {
          msg = `User [${userId}] is following User [${otherUserId}].`;
          UserHandler.handlleUserSuccess(states.FETCHED, msg, res);
        } else {
          errMsg = `User [${userId}] is not following User [${otherUserId}].`;
          UserHandler.handleUserError(states.NOT_FOUND, errMsg, res);
        }
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * Make the user with otherUserId following the user with userId.
   * @param {Object} req 
   * @param {Object} res 
   */

  static createFollower(req, res) {
    let errMsg = '';
    let msg = '';

    const { userId, otherUserId } = req.params;

    logger.info(
      `User [${otherUserId}] is going to follow User [${userId}]...`);

    UserRepository.createFollowing(otherUserId, userId)
      .then(([myUserExists, otherUserExists]) => {
        if (!myUserExists && !otherUserExists) {
          errMsg = `Both follower [${otherUserId}] and `;
          errMsg += `following users [${userId}] are not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else if (!myUserExists) {
          errMsg = `Following user [${userId}] is not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else if (!otherUserExists) {
          errMsg = `Follower user [${otherUserId}] is not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else {
          msg = `User [${otherUserId}] is following User [${userId}] now.`;
          UserHandler.handlleUserSuccess(states.CREATED, msg, res);
        }
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * Make the user with otherUserId not following the user with userId.
   * @param {Object} req 
   * @param {Object} res 
   */

  static deleteFollower(req, res) {
    let errMsg = '';
    let msg = '';

    const { userId, otherUserId } = req.params;

    logger.info(
      `User [${otherUserId}] is going to unfollow User [${userId}]...`);

    UserRepository.deleteFollowing(otherUserId, userId)
      .then(([myUserExists, otherUserExists]) => {
        if (!myUserExists && !otherUserExists) {
          errMsg = `Both follower [${otherUserId}] and `;
          errMsg += `following users [${userId}] are not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else if (!myUserExists) {
          errMsg = `Following user [${userId}] is not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else if (!otherUserExists) {
          errMsg = `Follower user [${otherUserId}] is not found.`;
          UserHandler.handlleUserSuccess(states.BAD_REQUEST, errMsg, res);
        } else {
          msg = `User [${otherUserId}] is not following User [${userId}] now.`;
          UserHandler.handlleUserSuccess(states.DELETED, msg, res);
        }
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * List all the followers the user with userId has.
   * @param {Object} req 
   * @param {Object} res 
   */

  static listAllFollowers(req, res) {
    let errMsg = '';
    let msg = '';

    const userId = req.params.userId;
    const { page, pageSize } = req.query;

    if ((page && !UserValidation.isPositiveInteger(page)) ||
      (pageSize && !UserValidation.isPositiveInteger(pageSize))) {
      errMsg = `The input page [${page}] or pageSize [${pageSize}] `;
      errMsg += `must be a positive integer.`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    logger.info(`Fetching followers records for user id [${userId}]` +
      ` with page [${page}] and pageSize [${pageSize}]...`);

    UserRepository.listAllFollowers(userId, page, pageSize)
      .then(users => {
        msg = `Successfully fetched ${users.length} user records.`;
        UserHandler.handlleUserSuccess(states.FETCHED, msg, res, users);
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * Check if the user with otherUserId is following the user with userId.
   * @param {Object} req 
   * @param {Object} res 
   */

  static findFollowerById(req, res) {
    let errMsg = '';
    let msg = '';

    const { userId, otherUserId } = req.params;

    logger.info(
      `Checking if User [${otherUserId}] is following User [${userId}]...`);

    UserRepository.FindFollowingById(otherUserId, userId)
      .then(exists => {
        if (exists) {
          msg = `User [${otherUserId}] is following User [${userId}].`;
          UserHandler.handlleUserSuccess(states.FETCHED, msg, res);
        } else {
          errMsg = `User [${otherUserId}] is not following User [${userId}].`;
          UserHandler.handleUserError(states.NOT_FOUND, errMsg, res);
        }
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * List all the friends the user with userId has.
   * @param {Object} req 
   * @param {Object} res 
   */

  static listAllFriends(req, res) {
    let errMsg = '';
    let msg = '';

    const userId = req.params.userId;
    const { radius, page, pageSize } = req.query;

    if (
      (radius && !UserValidation.isPositiveInteger(radius)) ||
      (page && !UserValidation.isPositiveInteger(page)) ||
      (pageSize && !UserValidation.isPositiveInteger(pageSize))
    ) {
      errMsg = `The input radius [${radius}], `
      errMsg += `page [${page}] or pageSize [${pageSize}] `;
      errMsg += `must be a positive integer.`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    logger.info(`Fetching friends records for user id [${userId}] ` +
      `with radius[${radius}], page [${page}] and pageSize [${pageSize}]...`);

    UserRepository.listAllFriends(userId, radius, page, pageSize)
      .then(users => {
        msg = `Successfully fetched ${users.length} user records.`;
        UserHandler.handlleUserSuccess(states.FETCHED, msg, res, users);
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

  /**
   * Check if the user with userId is a friend of the user with otherUserId.
   * @param {Object} req 
   * @param {Object} res 
   */

  static FindFriendById(req, res) {
    let errMsg = '';
    let msg = '';

    const { userId, otherUserId } = req.params;

    logger.info(
      `Checking if User [${userId}] is a friend of User [${otherUserId}]...`);

    UserRepository.FindFriendById(userId, otherUserId)
      .then(exists => {
        if (exists) {
          msg = `User [${userId}] is a friend of User [${otherUserId}].`;
          UserHandler.handlleUserSuccess(states.FETCHED, msg, res);
        } else {
          errMsg = `User [${userId}] is not a friend of User [${otherUserId}].`;
          UserHandler.handleUserError(states.NOT_FOUND, errMsg, res);
        }
      })
      .catch(err => {
        UserHandler.handleServerError(err, res);
      });
  }

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
      .then(users => {
        msg = `Successfully fetched ${users.length} user records.`;
        UserHandler.handlleUserSuccess(states.FETCHED, msg, res, users);
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

    const { longtitude, latitude } = fields.address;
    if (!UserValidation.isValidLongtitude(longtitude)) {
      errMsg = `The input address's longtitude [${longtitude}] should `;
      errMsg += `between -180.0 to 180.0.`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    if (!UserValidation.isValidLatitude(latitude)) {
      errMsg = `The input address's latitude [${latitude}] should `;
      errMsg += `between -85.0 to 85.0.`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    // Create a new user record.
    const user = new User(fields);
    const address = new Address(fields.address);

    logger.info(`Creating a new user record...`);

    UserRepository.createUser(user, address)
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
      .then(user => {
        if (user) {
          msg = `Found the target user ${user}.`;
          UserHandler.handlleUserSuccess(states.FETCHED, msg, res, user);
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
      errMsg += `has format YYYY-MM-DD.`;
      UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
      return;
    }

    if (fields.address) {
      const { longtitude, latitude } = fields.address;
      if (longtitude && !UserValidation.isValidLongtitude(longtitude)) {
        errMsg = `The input address's longtitude [${longtitude}] should `;
        errMsg += `between -180.0 to 180.0.`;
        UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
        return;
      }

      if (latitude && !UserValidation.isValidLatitude(latitude)) {
        errMsg = `The input address's latitude [${latitude}] should `;
        errMsg += `between -85.0 to 85.0.`;
        UserHandler.handleUserError(states.BAD_REQUEST, errMsg, res);
        return;
      }
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
