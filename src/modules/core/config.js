const {
	join,
	resolve
} = require("path");

const {
	ensureDirSync
} = require("fs-extra");



const env = process.env.NODE_ENV || 'development';
const config = require(`../../../config/config.${env}.json`);
const fullPathKeys = ['logDir', 'uploadDir', 'fileDir', 'trackingLogDir'];

function fullPath(config, keys) {
	const basePath = join(__dirname, '../../../', 'config');
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];
		let dirPath = resolve(basePath, config[key]);
		ensureDirSync(dirPath);
		config[key] = dirPath;
	}
}
config.configDir = join(__dirname, '../../../config');
if (!config.topicPostfix) {
	config.topicPostfix = "";
}
if (!config.groupPostfix) {
	config.groupPostfix = "";
}
fullPath(config, fullPathKeys);

module.exports = config;