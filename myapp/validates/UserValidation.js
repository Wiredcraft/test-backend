const USER_ALLOWED_INPUT_FIELDS = new Set(
  require('config').get('User.USER_ALLOWED_INPUT_FIELDS'));

const VALID_DATE_FORMAT = /^(\d{4})-(\d{2})-(\d{2})$/;
const VALID_INTEGER = /^\d+$/;

class UserValidation {

  /**
   * Validate if the input date has format YYYY-MM-DD.
   * @param {String} date
   * @returns {Boolean}
   */
  static isValidDate(date) {
    return VALID_DATE_FORMAT.test(date);
  }

  /**
   * Validate if the input string is a positive integer.
   * @param {String} s
   * @returns {Boolean} 
   */
  static isPositiveInteger(s) {
    return VALID_INTEGER.test(s) && s > 0;
  }

  /**
   * Validate if all the fields from the input are allowed.
   * @param {Object} fields
   * @returns {Boolean} 
   */
  static areAllInputFieldsAllowed(fields) {
    for (let field of Object.keys(fields)) {
      if (!USER_ALLOWED_INPUT_FIELDS.has(field)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validate if any required field has an empty value.
   * @param {Object} fields 
   * @returns {Boolean}
   */
  static isAnyRequiredFieldEmpty(fields) {
    for (let key of USER_ALLOWED_INPUT_FIELDS) {
      if (!fields[key]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validate if all required fields are empty.
   * @param {Object} fields
   * @returns {Boolean} 
   */
  static areAllRequiredFieldsEmpty(fields) {
    for (let key of USER_ALLOWED_INPUT_FIELDS) {
      if (fields[key]) {
        return false;
      }
    }
    return true;
  }

}

module.exports = UserValidation;
