const {ERR_CODE, SUC_CODE} = require('../utils/constant');

/**
 * This class is used to uniform return data format
 */
class Result {
  /**
   * Result constructor
   * @param data
   * @param msg
   * @param options
   */
  constructor(data, msg = 'success', options) {
    this.data = null;
    if (arguments.length === 0) {
      this.msg = 'success';
    } else if (arguments.length === 1) {
      this.msg = data;
    } else {
      this.data = data;
      this.msg = msg;
      if (options) {
        this.options = options;
      }
    }
  }

  /**
   * return json data
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
    if (this.data) {
      base.data = this.data;
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
