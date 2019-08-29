"use strict";
var log = require("color-logs")(true, true, __filename);
var mongoose = require("mongoose");

module.exports = (req, res, next) => {
  log.info("connecting to mongo");
  let bucket = require('../config').bucket;
  if(!bucket) {
    log.error(500, "Impossible to connect to mongo: empty bucket");
  }
  let mongoConn = "mongodb://localhost:27017/" + bucket;
  log.info("connecting into " + mongoConn);
  mongoose.connect(mongoConn, { useNewUrlParser: true, useCreateIndex: true });

	next();
};
