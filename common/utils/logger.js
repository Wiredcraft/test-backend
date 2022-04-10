"use strict";

let log4js = require("log4js");

log4js.configure({
  appenders: { "test-backend": { type: "console" } },
  categories: {
    default: {
      appenders: ["test-backend"],
      level: "debug",
    },
  },
});
module.exports = log4js.getLogger("test-backend");
