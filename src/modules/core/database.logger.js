const {
	env
} = require("./config");
import {
	createLogger
} from './logger.util';
import cluster from 'cluster';


const {
	appName = "app"
} = process.env;

let pid = "master";
if (!cluster.isMaster) {
	if (process.env.NODE_APP_INSTANCE) {
        //使用pm2提供的id,重启不会变化
        pid = "w" + process.env.NODE_APP_INSTANCE;
    } else {
        pid = "w" + process.pid;
    }
}

let taskLogger = createLogger({
	logPath: `${appName}_database_${pid}.txt`
});

function saveLogAndReload() {
	taskLogger.reopenFileStreams();
}
if (env != "development") {
	//pm2使用SIGINT
	process.on('SIGINT', function () {
		saveLogAndReload();
		setTimeout(function () {
			process.exit(0);
		}, 1000);
	});
} else {
	//nodemon使用SIGUSR2
	process.once('SIGUSR2', function () {
		saveLogAndReload();
		setTimeout(function () {
			process.kill(process.pid, 'SIGUSR2');
		}, 100);
	});
}
export {
	taskLogger
}