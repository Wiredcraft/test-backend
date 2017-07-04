/*
* @Author: alutun
* @Date:   2017-07-03 13:37:09
* @Last Modified by:   alutun
* @Last Modified time: 2017-07-04 15:14:10
*/

'use strict';

var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.postGreSql;

ds.automigrate(null, function(err, actual) {
  if (err) {
    throw err;
  } else {
    console.log('Database has been reset');
  }
});
