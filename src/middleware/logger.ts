import path = require('path')
import log4js = require('koa-log4')
const logDir = path.resolve('logs')
log4js.configure({
    appenders: {
        application: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
            alwaysIncludePattern: true, // 文件名始终以日期区分
            daysToKeep: 30, // 大于0则会删除x天之前的日
            encoding: 'utf-8',
            filename: path.join(logDir, 'app'),
        },
        error: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', // 通过日期来生成文件
            alwaysIncludePattern: true, // 文件名始终以日期区分
            daysToKeep: 30, // 大于0则会删除x天之前的日
            encoding: 'utf-8',
            filename: path.join(logDir, 'error'), // 生成文件名
        },
        out: {
            type: 'console',
        },
    },
    categories: {
        default: { appenders: ['out'], level: 'info' },
        application: { appenders: ['application'], level: 'info' },
        error: { appenders: ['error'], level: 'error' },
    },
})
export const appLogger = log4js.koaLogger(log4js.getLogger('application'), {
    format: ':remote-addr - ":method :url HTTP/:http-version" - :status :content-length :response-timems ":referrer"',
})

export const errorLogger = log4js.getLogger('error')