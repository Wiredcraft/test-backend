import moment from 'moment';
import { configure, getLogger } from 'log4js';
configure({
    appenders: {
        /**
         * 系统运行通用日志
         */
        system: {
            type: 'file',
            layout: { type: 'basic' },
            filename: `./log/system_${moment().format('YYYMMDDHH')}.log`
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
        default:
        {
            appenders: ['system'],
            level: 'debug'
        }
    }
});

/**
 * 系统运行通用日志
 */
const system = getLogger('system');

/**
 * 处理用户业务时的日志
 */
const user = getLogger('user');

/**
 * 发生错误时的日志
 */
const error = getLogger('error');

/**
 * redis操作过程中日志
 */
const redis = getLogger('redis');

export { system, error, user, redis }



