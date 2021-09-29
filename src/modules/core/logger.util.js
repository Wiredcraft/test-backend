import path from "path";
import bunyan from "bunyan";
import config from "./config";
import RotatingFileStream from "bunyan-rotating-file-stream";

const {
	logDir,
	logLevel: _logLevel = "info",
	logRotatePeriod: _logRotatePeriod = '1d',
    maxLogFileCount: _maxLogFileCount = 30,
    gzip: _gzip = true
} = config;


export function createLogger(info) {
	let lastInfo = Object.assign({}, {
		logLevel: _logLevel,
		logRotatePeriod: _logRotatePeriod,
        maxLogFileCount: _maxLogFileCount,
        gzip: _gzip
	}, info);
	let {
		logPath,
		logLevel,
		logRotatePeriod,
        maxLogFileCount,
        gzip
	} = lastInfo;
	logPath = path.join(logDir, logPath);
	let logger = bunyan.createLogger({
		name: "webapi",
		streams: [{
			type: 'raw',
			stream: new RotatingFileStream({
				path: logPath,
				period: logRotatePeriod,
				totalFiles: maxLogFileCount,
				rotateExisting: true,
				threshold: '10m',
				totalSize: '20m',
				gzip
			})
		}],
		serializers: {
			err: bunyan.stdSerializers.err,
			req: bunyan.stdSerializers.req,
			res: bunyan.stdSerializers.res
		}
	});
	logger.level(logLevel);
	return logger;
}