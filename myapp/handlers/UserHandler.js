const logger = require('log4js').getLogger('UserHandler');
const states = require('../constants/states');

class UserHandler {

  /**
   * Handler for server errors.
   * @param {Object} err 
   * @param {Object} res 
   */

  static handleServerError(err, res) {
    logger.error(err);
    res.status(states.INTERNAL_SERVER_ERROR).end();
  };

  /**
   * Handler for user errors.
   * @param {String} statusCode 
   * @param {String} errMsg 
   * @param {Object} res 
   */
  static handleUserError(statusCode, errMsg, res) {
    logger.error(errMsg);
    res.json({
      code: statusCode,
      message: errMsg
    });
  }

  /**
   * Handler for user success.
   * @param {String} statusCode 
   * @param {String} msg 
   * @param {Object} res 
   * @param {Object} data 
   */
  static handlleUserSuccess(statusCode, msg, res, data = null) {
    logger.info(msg);
    if (data) {
      res.json(data);
    } else {
      res.json({
        code: statusCode,
        message: msg
      });
    }
  }
}

module.exports = UserHandler;