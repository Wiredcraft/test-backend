const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

/* API routes */
const users = require('./server/routes/users');

/* Database setup */
const config = require('./server/config/config')
// connect the database
mongoose.connect(config.url)
// check if the database is running
mongoose.connection.on('connected', () => {
  console.log('Database connected')
})
mongoose.connection.on('error', () => {
  console.error('Database connection error. Make sure your database is running')
})

const app = express();

/*
 * uncomment for setting up server side view rendering
 */

// // view engine setup
// app.set('views', path.join(__dirname, 'server/views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
