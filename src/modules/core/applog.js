'use strict'

import config from './config';
import {
	chanceGuid,
    getLocalIPAdress
} from "../util/helper";
import {
	isObject
} from 'lodash'
var url = require('url');
import {
	createLogger
} from './logger.util';
import cluster from 'cluster';
import moment from 'moment-timezone';

/**
 * 日志封装，常规用法：
 * import applog from 'pathto/AppLog'
 * applog.info(ctx,"日志标题")
 * applog.info(ctx,"标题","日志数据，任意类型")
 * applog.debug...
 * applog.warn...
 */
class AppLog {

	constructor() {
		this.appName = config.appId || config.authAppId || config.upm.appId;
		// this.appName = '';
        this.getAppLogger();
	}

	/**
	 * @param {Object} ctx 
	 * @param {String} msg 
	 * @param {Any} msgData
	 */
	info(...args) {
		this._baseLog('info', ...args);
	}

	/**
	 * @param {Object} ctx 
	 * @param {String} msg 
	 * @param {Any} msgData
	 */
	debug(...args) {
		this._baseLog('debug', ...args);
	}

	/**
	 * @param {Object} ctx 
	 * @param {String} msg 
	 * @param {Any} msgData
	 */
	trace(...args) {
		this._baseLog('trace', ...args);
	}

	/**
	 * @param {Object} ctx 
	 * @param {String} msg 
	 * @param {Any} msgData
	 */
	warn(...args) {
		this._baseLog('warn', ...args);
	}

	/**
	 * @param {Object} ctx 
	 * @param {Object} error
	 */
	error(ctx, error) {
		this._baseLog('error', ctx, '', {}, '', error);
	}

	/**
	 * @param {Object} ctx 
	 * @param {String} msg 
	 * @param {Any} msgData
	 */
	fatal(...args) {
		this._baseLog('fatal', ...args);
	}

	/**
	 * 获取日志Handler
	 */
	getAppLogger() {
		let appPath = process.env.pm_exec_path || process.argv[1];
		let logFileName = this.appName;
		if (appPath.indexOf('src/') == -1) {
			logFileName = logFileName + "-" + appPath.split('/').pop()
		} else {
			logFileName = logFileName + "-" + appPath.split('src/')[1].split('/').join('-')
		}
		if (logFileName.substr(-3) == '.js') {
			logFileName = logFileName.substr(0, logFileName.length - 3)
		}
        
        let pid='master';
        if (!cluster.isMaster) {
            if (process.env.NODE_APP_INSTANCE) {
                pid = "w" + process.env.NODE_APP_INSTANCE;
            } else {
                pid = "w" + process.pid;
            }
        }

        let localIP = getLocalIPAdress();

        this.appLogger = createLogger({
            logLevel: "info",
            logPath: `${logFileName}-${localIP}-${pid}.txt`
        });
	}

	/**
	 * 基础日志方法
	 * @param {*} logLevel 
	 * @param {*} ctx 
	 * @param {*} msg 
	 */
	_baseLog(logLevel, ctx, msg = '', msgData = {}, transactionId = '', errorObject = null) {
		if (ctx && ctx.body && ctx.body.status && ctx.body.status.errObj) {
			errorObject = ctx.body.status.errObj;
			logLevel = "error";
			delete ctx.body.status.errObj
		}
		if (errorObject) {
			msg = errorObject.message
		}
		if(isObject(msg)){
			msg = JSON.stringify(msg);
		}
		msg = msg.substr(0,500);
		let ip = ctx && ctx.headers && ctx.headers['x-forwarded-for'] || ''
		if(!ip){
			ip = ctx && ctx.connection && ctx.connection.remoteAddress || ''
		}
		if(!ip){
			ip = ctx && ctx.socket && ctx.socket.remoteAddress || ''
		}
		if(!ip){
			ip = ctx && ctx.connection && ctx.connection.socket && ctx.connection.socket.remoteAddress || ''
		}
		let logData = {
			timestamp: new moment.tz(new Date(), 'Asia/Shanghai').format("YYYY-MM-DD HH:mm:ss.SSS"),
			labels: {
				application: this.appName,
				env: config.env
			},
			message: msg,
			message_data: msgData,
			stack_trace: (new Error()).stack.split('\n').slice(1),
			service: this._getService(ctx),
			trace: {
				id: ctx && ctx.headers && ctx.headers['x-trace-id'] || '',
			},
			span: {
				id: ctx && ctx.headers && ctx.headers['x-span-id'] || '',
			},
			transaction: {
				id: transactionId
			},
			error: this._getError(ctx, errorObject),
			log: {
				level: logLevel
			},
			user: {
				ip:ip
			},
			user_agent: {
				original: (ctx && ctx.request && ctx.request.header && ctx.request.header['user-agent'] || ''),
				ip:(ctx && ctx.ccData && ctx.ccData.user && ctx.ccData.user.ip || '')
			}
		}
		
		this.appLogger[logLevel](logData)
	}

	_getError(ctx, err) {
		if (!err) {
			return {}
		}
		return {
			code: err.code,
			id: chanceGuid(),
			message: err.message,
			stack_trace: err.stack,
			type: err.name
		}
	}

	_getService(ctx) {
		let service = {
			id: ctx && ctx._matchedRoute || "",
			name: (ctx && ctx._matchedRouteName) || (ctx && ctx._matchedRoute) || "",
			group: this.appName,
			type: "Web API",
			version: config.version || "1.0",
			request: {
				url: ctx && ctx.request && ctx.request.url || '',
				method: ctx && ctx.request && ctx.request.method || '',
				query_parameter: ctx && ctx.request && ctx.request.url && url.parse(ctx.request.url).query || '',
				query_object: ctx && ctx.request && ctx.request.query || '',
				referrer: ctx && ctx.header && ctx.header.referrer || '',
				header: ctx && ctx.request && ctx.request.header || '',
				ip: ctx && ctx.ip || '',
				body: {
					content: ctx && ctx.request && ctx.request.body || '',
				}
			},
			response: {},
			duration: ctx && ctx.ccData && ctx.ccData.startTimestamp && (new Date().getTime() - ctx.ccData.startTimestamp) || 0,
		}
		if (ctx && ctx.response && ctx.response.header && Object.keys(ctx.response.header).length > 0 && ctx.response.header['content-type']) {
			if (ctx.response.header['content-type'].indexOf('json') > -1 ||
				ctx.response.header['content-type'].indexOf('text') > -1 ||
				ctx.response.header['content-type'].indexOf('xml') > -1
			) {
				let responseBody = ctx.body;
				if(isObject(responseBody)){
					responseBody = JSON.stringify(responseBody);
				}
				responseBody = responseBody.substr(0,500) // 截取500个字符
				service.response = {
					header: ctx.response.header,
					status_code: ctx.status,
					body: {
						content: responseBody,
					}
				}
			}
		}
		return service;
	}
}

export default new AppLog()