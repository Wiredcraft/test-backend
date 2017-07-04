/*
* @Author: alutun
* @Date:   2017-07-03 09:44:37
* @Last Modified by:   alutun
* @Last Modified time: 2017-07-04 15:15:18
*/

'use strict';

var path = require('path');

var app = require(path.resolve(__dirname, '../server'));
var ds = app.datasources.postGreSql;

ds.isActual(null, function(err, actual) {
  console.log('Checking Database Structure.');
  	if (!actual) {
  		console.log('Database Schema Structure is different.');
    	ds.autoupdate(null, function(err, result) {  // using NULL to apply to all the model
      		console.log('Database Schema Structure is now up to date.');
    	});
  	} else {
  		console.log('Database Structure is matching !');
  	}
});
