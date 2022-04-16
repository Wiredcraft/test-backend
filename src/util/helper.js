const _ = require('lodash');

const helper = {

  /**
   * Check if the required fields exist
   * @param {Object} target
   * @param {String[]} required
   * @returns {Boolean}
   */
  checkRequired(target, required) {
    const missing = required.filter((path) => _.get(target, path) == null);
    if (missing.length) {
      throw new errors.BadRequestError(`${missing} is/are required`);
    }
    return true;
  },

};

module.exports = _.mixin(helper);
