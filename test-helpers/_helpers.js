"use strict";
var log = require("color-logs")(true, true, __filename);

var mongoose = require('mongoose');

module.exports = {
	db_open: (done) => {
		mongoose.connect("mongodb://localhost:27017/wiredcraft-testing", {useNewUrlParser: true }, () => {
			try {
				mongoose.connection.db.dropDatabase(done);
			} catch(ex) {
				log.error(ex);
				log.error("could not start mongo. is mongod running?");
				throw(ex);
			}
		});
	},
	db_close: (done) => {
    mongoose.connection.close(done);
	}
};
