/* 
 * Get the modules used to power this app
 */

const config = require('./config');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

/**
 * Set up the database connection
 **/

let db_host = config.db.host;
let db_port = config.db.port;
let db_name = config.db.name;

let conn_str = `mongodb://${db_host}:${db_port}/${db_name}`;

/**
 * Options Explained
 * useNewUrlParser: allow users to fall back to the old parser if they find a bug in the new parser
 * useUnifiedTopology: server discover and monitor engine
 * useCreateIndex: help Mongoose's default index build avoid deprecation warnings
 * keepAlive: to avoid connection closed errors
 **/

mongoose.connect(conn_str, {useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useCreateIndex: true,
                            keepAlive: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

console.log(`Database: ${conn_str}`)

var btapp = express();

//View engine setup
btapp.set('views', path.join(__dirname, 'views'));
btapp.set('view engine', 'ejs');

// Set up the file for logging
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'test_backend.log'),
                                           {flags: 'a'});
btapp.use(logger('combined', {stream: accessLogStream}));

// Use the body parser for url parsing in the routes
btapp.use(bodyParser.json())
btapp.use(bodyParser.urlencoded({extended: false}));

//Set up the static path to assets like javascript and images
btapp.use(express.static(path.join(__dirname, 'public')));


// Catch 404 errors and forward to an error handler
btapp.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Tell btapp which port to listen on
let app_port = config.app.port;
btapp.listen(app_port);
console.log(`You are listening on port ${app_port}`);

module.exports = btapp;

