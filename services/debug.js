"use strict";
var log = require("color-logs")(true, true, __filename);

module.exports = (req, res, next) => {
	log.info("NEW REQUEST: ===============================>");
	log.info(req.url+" ("+req.method+")");
	log.info("params: ", req.body);

	next();
};
