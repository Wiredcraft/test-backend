import winston, { format, transport } from 'winston';
import expressWinston from 'express-winston';

export const accessLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: format.combine(format.timestamp(), format.json())
    }),
  ],
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
});
