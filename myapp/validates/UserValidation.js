const USER_ALLOWED_INPUT_FIELDS = new Set(
  require('config').get('User.USER_ALLOWED_INPUT_FIELDS')
);

const ADDRESS_ALLOWED_INPUT_FIELDS = new Set(
  require('config').get('User.ADDRESS_ALLOWED_INPUT_FIELDS')
);

const VALID_DATE_FORMAT = /^(\d{4})-(\d{2})-(\d{2})$/;
const VALID_INTEGER = /^\d+$/;
const VALID_GEO_COORDINATES = /^-?[0-9]{1,3}(?:\.[0-9]{1,4})?$/;

class UserValidation {

  /**
   * Validate if the input longtitude is between -180 to 180.
   * @param {String} longtitude 
   * @returns {Boolean}
   */
  static isValidLongtitude(longtitude) {
    if (VALID_GEO_COORDINATES.test(longtitude)) {
      const val = parseFloat(longtitude);
      if (val >= -180.0 && val <= 180.0) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validate if the input latitude is between -85 to 85.
   * @param {String} latitude 
   * @returns {Boolean}
   */
  static isValidLatitude(latitude) {
    if (VALID_GEO_COORDINATES.test(latitude)) {
      const val = parseFloat(latitude);
      if (val >= -85.0 && val <= 85.0) {
        return true;
      }
    }

    return false;
  }

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
    for (const userField of Object.keys(fields)) {
      if (!USER_ALLOWED_INPUT_FIELDS.has(userField)) {
        return false;
      }
    }

    if (fields.address) {
      for (const addressField of Object.keys(fields.address)) {
        if (!ADDRESS_ALLOWED_INPUT_FIELDS.has(addressField)) {
          return false;
        }
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
    for (const userField of USER_ALLOWED_INPUT_FIELDS) {
      if (!fields[userField]) {
        return true;
      }
    }

    if (!fields.address) {
      return true;
    }

    for (const addressField of ADDRESS_ALLOWED_INPUT_FIELDS) {
      if (!fields.address[addressField]) {
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
    for (const userField of USER_ALLOWED_INPUT_FIELDS) {
      if (fields[userField] && userField !== 'address') {
        return false;
      }
    }

    if (fields.address) {
      for (const addressField of ADDRESS_ALLOWED_INPUT_FIELDS) {
        if (fields.address[addressField]) {
          return false;
        }
      }
    }

    return true;
  }

}

module.exports = UserValidation;
