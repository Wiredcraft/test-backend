var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

const config = require('config');

const mongo = require('./mongo');
mongo.connect(config.mongo);

const redis = require('./redis');
redis.createClient(config.redis);

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const route = require("./routes");
route(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  return res.status(err.status || 500).send(err.message || err);
});

const server = app.listen(config.port || 8001)

module.exports = app;
