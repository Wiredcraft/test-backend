"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.user = exports.error = exports.system = void 0;
const moment_1 = __importDefault(require("moment"));
const log4js_1 = require("log4js");
log4js_1.configure({
    appenders: {
        /**
         * 系统运行通用日志
         */
        system: {
            type: 'file',
            layout: { type: 'basic' },
            filename: `./log/system_${moment_1.default().format('YYYMMDDHH')}.log`
        },
        // /**
        //  * 处理用户业务时的日志
        //  */
        // user: {
        //     type: 'file',
        //     layout: { type: 'basic' },
        //     filename: `./log/user_${moment().format('YYYMMDDHH')}.log`
        // },
        // redis: {
        //     type: 'file',
        //     layout: { type: 'basic' },
        //     filename: `./log/redis_${moment().format('YYYMMDDHH')}.log`
        // },
        // /**
        //  * 发生错误时的日志
        //  */
        // error: {
        //     type: 'file',
        //     layout: { type: 'basic' },
        //     filename: `./log/error_${moment().format('YYYMMDDHH')}.log`
        // },
    },
    categories: {
        default: {
            appenders: ['system'],
            level: 'debug'
        }
    }
});
/**
 * 系统运行通用日志
 */
const system = log4js_1.getLogger('system');
exports.system = system;
/**
 * 处理用户业务时的日志
 */
const user = log4js_1.getLogger('user');
exports.user = user;
/**
 * 发生错误时的日志
 */
const error = log4js_1.getLogger('error');
exports.error = error;
/**
 * redis操作过程中日志
 */
const redis = log4js_1.getLogger('redis');
exports.redis = redis;
//# sourceMappingURL=logger.js.map