'use strict';

const CustomLogger = require('./customLogger');

module.exports = {
  get swLog() {
    return CustomLogger(this);
  }
}
