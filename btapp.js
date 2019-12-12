/* 
 * Get the modules used to power this app
 */

const config                = require('./config/config');
const express               = require('express');
const session               = require('express-session');
const logger                = require('morgan');
const mongoose              = require('mongoose')
const bodyParser            = require('body-parser');
const fs                    = require('fs');
const log                   = require('./libs/log')(module);
const path                  = require('path');
const passport              = require('passport');
const userApiRouter         = require('./routes/userApiRoutes');
const userWebRouter         = require('./routes/userWebRoutes');
const securityRouter        = require('./routes/securityRoutes');
const oauthRouter           = require('./routes/oauthRoutes');

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
                            useFindAndModify: false,
                            keepAlive: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

console.log(`Database: ${conn_str}`)

var btapp = express();

// View engine setup
btapp.set('views', path.join(__dirname, 'views'));
btapp.set('view engine', 'ejs');

// Set up the file for logging
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'test_backend.log'),
                                           {flags: 'a'});
btapp.use(logger('combined', {stream: accessLogStream}));

// Use the body parser for url parsing in the routes
btapp.use(bodyParser.json())
btapp.use(bodyParser.urlencoded({extended: true}));

// Set up the session so that we can use session variables and the like.
btapp.use(session({secret: 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch',
                 saveUninitialized: false,
                 resave: false,
                 cookie: {secure: false}
        }));

// Set up the static path to assets like javascript and images
btapp.use(express.static(path.join(__dirname, 'public')));

// Initialize passport
btapp.use(passport.initialize());
btapp.use(passport.session());
require('./config/auth');

// Use the routing 
btapp.use('/api', userApiRouter);
btapp.use('/', userWebRouter);
btapp.use('/', securityRouter);
btapp.use('/auth', oauthRouter);

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

