'use strict';
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();

var auth = require('./auth.js');
auth.init();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'wild dog', resave: true, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//according https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js#L101-L113,
//set failureFlash as true here we can retrieve the error message through flash if login failed.
app.post('/login', passport.authenticate('local', { successRedirect: '/index', failureRedirect: '/login/:redo?', failureFlash: true }));

//as an api entry, we donn't redirect here, TODO I still have no idea about how/why to call this.
app.post('/api/login',
  passport.authenticate('local'),
  function(req, res) {
    //console.log(req.user);
    res.sendStatus(200);
  });
app.get('/index', authCheck, function(req, res) {
  res.status(200).send('Welcome: ' + req.user.id);
});
app.get('/login', function(req, res) {
  res.render('login');
});
app.get('/login/:redo?', function(req, res) {
  res.render('login',  req.params.redo ? { message: req.flash('error') } : null);
});

function authCheck(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
module.exports = app;
