const Config = require("../config")

const { createLogger, format, transports, addColors } = require('winston');
const { combine, timestamp, printf } = format;
const path = require('path');
const {TimestampOptions} = require("logform")

// 配置等级和颜色
const config = {
  levels: {
    error: 0,
    warn: 1,
    data: 2,
    info: 3,
    verbose: 4,
    silly: 5,
    http: 6,
    debug: 7,
  },
  colors: {
    error: 'red',
    debug: 'gray',
    warn: 'yellow',
    data: 'green',
    info: 'blue',
    verbose: 'cyan',
    silly: 'magenta',
    http: 'yellow'
  }
}
// 添加自定义颜色
addColors(config.colors)
function formatParams(info) {
  let { timestamp, level, message } = info
  message = typeof message === 'string' && message || JSON.stringify(message)
  return `[${timestamp}] ${level}: ${message}`
}
const logger = createLogger({
  level: 'http',
  levels: config.levels,
  handleExceptions: true,
  json: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(formatParams)
  ),
  transports: [
    new (transports.Console)(),
    new (transports.File)({
      filename: path.join(__dirname, `${Config.LOG_PATH}/error.log`),
      maxsize: 5242880, // 5MB,
      level: 'error',
    }),
    new (transports.File)({
      filename: path.join(__dirname, `${Config.LOG_PATH}/info.log`),
      maxsize: 5242880, // 5MB,
      level: 'info',
    }),
    new (transports.File)({
      filename: path.join(__dirname, `${Config.LOG_PATH}/http.log`),
      maxsize: 5242880, // 5MB,
      level: 'http',
    }),
    new (transports.File)({
      filename: path.join(__dirname, `${Config.LOG_PATH}/all.log`),
      maxsize: 5242880, // 5MB,
      level: 'debug',
    }),
  ]
});

if(process.env.NODE_ENV === 'dev'){
  //开发/测试环境
  logger.level = 'debug'
}
if(process.env.NODE_ENV === 'unit-test'){
  //单元测试
  logger.level = 'error'
}
logger.info("*****current env*****: " + process.env.NODE_ENV);

// 添加morgan日志信息
logger.stream = {
  write: function(message, encoding) {
    logger.http(message)
  }
}

module.exports = logger;
