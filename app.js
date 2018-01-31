const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('cookie-session')
/* Seneca imports */
const seneca = require('seneca')()
const senecaWeb = require('seneca-web')

const keys = require('./server/config/keys')

/* API routes */
const users = require('./server/routes/users');
const employees = require('./server/routes/employees')

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

/* Configure passport */
require('./server/config/passport')(passport)

/* setup senecaWeb */
const Router = express.Router
const context = new Router()

const senecaWebConfig = {
  context: context,
  adapter: require('seneca-web-adapter-express'),
  options: { parseBody: false } // for body-parser to be used
}

/*
 * uncomment for setting up server side view rendering
 */

// // view engine setup
// app.set('views', path.join(__dirname, 'server/views'));
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
/* register context for seneca */
app.use(context)

/* setup cookie-session before you initialize passport */
app.use(session({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
}))

app.use(passport.initialize())
app.use(passport.session())

/* the api entry point */
app.use('/api/v1/', employees)
app.use('/', users);

/* Integrate seneca and express */
seneca.use(senecaWeb, senecaWebConfig)
seneca.use('./server/routes/seneca-api')
      .client({ type:'tcp', pin:'role:employees'})

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
