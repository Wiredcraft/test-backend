import { createLogger, format, transports } from 'winston';
import config from '../common/config';

const { combine, timestamp, json } = format;

const errorFilter = format((info) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = format((info) => {
  return info.level === 'info' ? info : false;
});

const logFilter = format((info) => {
  return info.level === 'warn' ? info : false;
});

const timeFromatOpt = { format: 'YYYY-MM-DD HH:mm:ss' };

const logger = createLogger({
  level: process.env.LOG_LEVEL || config.get('Log.logLevel') || 'info',
  format: format.combine(timestamp(timeFromatOpt), json()),
  transports: [
    new transports.File({
      filename: './logs/app-error.log',
      level: 'error',
      format: combine(errorFilter(), timestamp(timeFromatOpt), json()),
    }),
    new transports.File({
      filename: './logs/app-info.log',
      level: 'info',
      format: combine(infoFilter(), timestamp(timeFromatOpt), json()),
    }),
    new transports.File({
      filename: './logs/app-log.log',
      level: 'warn',
      format: combine(logFilter(), timestamp(timeFromatOpt), json()),
    })
  ],

});

export default logger;
