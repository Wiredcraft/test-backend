/*
* @Author: alutun
* @Date:   2017-07-03 13:37:09
* @Last Modified by:   alutun
* @Last Modified time: 2017-07-03 13:40:35
*/

'use strict';

var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.postGreSql;

ds.automigrate(null, function(err, actual)
{
	if (err)
	{
		throw err;
	}
	else
	{
		console.log("Database has been reset");
	}
});

// ds.isActual(null, function(err, actual) // using NULL to apply to all the models
// {
// 	console.log("Checking Database Structure.");
//   	if (!actual) 
//   	{
//   		console.log("Database Schema Structure is different.")
//     	ds.autoupdate(null, function(err, result) // using NULL to apply to all the model
//     	{
//       		console.log("Database Schema Structure is now up to date.")
//     	});
//   	}
//   	else
//   	{
//   		console.log("Database Structure is matching !");
//   	}
// });
