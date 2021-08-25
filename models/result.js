const {ERR_CODE, SUC_CODE} = require('../utils/constant');

/**
 * This class is used to uniform return result format
 */
class Result {
  /**
   * Result constructor
   * @param result
   * @param msg
   * @param options
   */
  constructor(result, msg = 'success', options) {
    this.result = null;
    if (arguments.length === 0) {
      this.msg = 'success';
    } else if (arguments.length === 1) {
      this.msg = result;
    } else {
      this.result = result;
      this.msg = msg;
      if (options) {
        this.options = options;
      }
    }
  }

  /**
   * return json result
   * @param res
   * @returns {*}
   */
  json(res) {
    return res.json(this.createResult());
  }

  /**
   * createResult
   * @returns {{msg: (string|*), code: (number|*)}}
   */
  createResult() {
    if (!this.code) {
      this.code = SUC_CODE;
    }
    let base = {
      code: this.code,
      msg: this.msg,
    };
    if (this.result) {
      base.result = this.result;
    }
    if (this.options) {
      base = {...base, ...this.options};
    }
    return base;
  }

  /**
   * return success msg
   * @param res
   * @returns {*}
   */
  success(res) {
    this.code = SUC_CODE;
    return this.json(res);
  }

  /**
   * return error msg
   * @param res
   * @returns {*}
   */
  fail(res) {
    this.code = ERR_CODE;
    return this.json(res);
  }
}

module.exports = Result;
