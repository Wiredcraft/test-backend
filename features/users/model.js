"use strict";
var debugEnabled = require("../../config").debug;
var log = require("color-logs")(debugEnabled, debugEnabled, __filename);

var mongoose = require("mongoose").set('debug', debugEnabled);
var Schema = mongoose.Schema;

var sch = new Schema({
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date
  },
  address: {
  	type: String,
  },
  description: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", sch, "Users");
