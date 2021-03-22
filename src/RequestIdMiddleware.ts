import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConstVariable } from './Common/ConstVariable';
import { randomBytes } from 'crypto';

/**
 * if REQUESR_ID not found
 */
export default class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): any {
    const reqId = req.get(ConstVariable.REQUESR_ID);
    if (!reqId) {
      req.headers[ConstVariable.REQUESR_ID] = randomBytes(16).toString('hex');
    }
    return next();
  }
}
