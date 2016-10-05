'use strict';

var chai = require('chai');
chai.should();

global.wct = {
  moment: require('moment'),
  app: require('require-main')()
};
