const Express = require("express");
const app = Express();
const appCommon = require("./common.js");
appCommon.init(app);
module.exports = app;


