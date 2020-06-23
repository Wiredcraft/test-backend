/* eslint-disable no-underscore-dangle */
import { RequestUser } from 'customUser';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import passport from 'passport';

import { AccessType } from '../models/access';
import User, { Roles } from '../models/user';
import { errorHandler } from '../util/errorHandler';
import { getLogger } from '../util/logger';
import { getModel } from '../util/modelScanner';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default (modelName: string, requiredAccess: AccessType): RequestHandler =>
  errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Authorize begin');
    logger.debug(`required access ${requiredAccess}`);
    let statusCode = 403;
    let authorized = false;

    const Item = await getModel(modelName);
    const modelAccess = Item.access;

    // auth not needed
    if (modelAccess.everyone >= AccessType.readOnly) {
      next();
      authorized = true;
    } else {
      // jwt auth
      try {
        await new Promise((resolve): void => {
          passport.authenticate('jwt', { session: false })(req, res, resolve);
        });
      } catch (err) {
        logger.warn(`Failed auth attempt: ${err}`);
      }

      // current logged in user
      const currentUser = await User.findOne({ name: (<RequestUser>req.user).name });

      if (currentUser) {
        // setup user for next middleware use
        (<RequestUser>req.user).id = currentUser._id;
        (<RequestUser>req.user).role = currentUser.role;

        // admin will always have access
        if (currentUser.role === Roles.admin) {
          next();
          authorized = true;
        }

        // operator
        if (currentUser.role === Roles.operator && modelAccess.operator >= requiredAccess) {
          next();
          authorized = true;
        }

        // everyone
        if (currentUser.role === Roles.user && modelAccess.user >= requiredAccess) {
          next();
          authorized = true;
        }

        // self
        if (currentUser.role === Roles.user && !authorized && modelAccess.self >= requiredAccess) {
          // ownership checking
          if (req.params && req.params[`${modelName}Id`]) {
            const itemId = req.params[`${modelName}Id`];
            const item = await Item.findOne({ _id: itemId });
            if (item && item.owner && item.owner === currentUser.id) {
              next();
              authorized = true;
            }
          }
        }
      } else {
        // not authenticated
        statusCode = 401;
      }
    }

    if (!authorized) {
      res.status(statusCode).send(statusCode === 401 ? 'Unauthorized' : 'Forbidden');
    }
  });
