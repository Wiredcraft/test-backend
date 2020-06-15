import type { Request, Response, NextFunction } from 'express';
import getLogger from './logger';
import { colors } from './consts';

const logger = getLogger('api');

export default (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', () => {
    logger.info(
      `${req.method} ${colors.FgCyan}${req.originalUrl} ${colors.FgYellow}${res.statusCode}`
    );
  });
  next();
};
