import type { Request, Response, NextFunction } from 'express';
import { Colors } from './consts';
import { getLogger } from './logger';

const logger = getLogger('api');

export default (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', () => {
    logger.info(
      `${req.method} ${Colors.FgCyan}${req.originalUrl} ${Colors.FgYellow}${res.statusCode}`
    );
  });
  next();
};
