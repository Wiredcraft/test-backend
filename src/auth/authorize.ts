/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, RequestHandler, Response } from 'express';
import passport from 'passport';

import { AccessInterface, AccessType } from '../models/access';
import User, { Roles } from '../models/user';
import { errorHandler } from '../util/errorHandler';
import { importHelper } from '../util/importHelper';
import { getLogger } from '../util/logger';
import { getModelList } from '../util/modelScanner';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default (modelName: string, requiredAccess: AccessType): RequestHandler =>
  errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Authorize begin');
    logger.info(`required access ${requiredAccess}`);
    let statusCode = 403;
    let authorized = false;

    const accessMap: { [key in AccessType]: number } = {
      [AccessType.noAccess]: 0,
      [AccessType.readOnly]: 1,
      [AccessType.fullAccess]: 2,
    };

    const Item = await builder.getModel(modelName);
    const modelAccess = builder.acl[modelName];

    // auth not needed
    if (accessMap[modelAccess.everyone] >= accessMap[AccessType.readOnly]) {
      next();
      authorized = true;
    } else {
      // jwt auth
      try {
        await new Promise<void>((resolve): void => {
          passport.authenticate('jwt', { session: false })(req, res, resolve);
        });
      } catch (err) {
        logger.warn(`Failed auth attempt: ${err}`);
      }

      // current logged in user
      const authUser = await User.findOne({ username: req.user?.name });

      if (authUser) {
        // setup user for next middleware use
        req.user.id = authUser._id;
        req.user.role = authUser.role;

        // admin will always have access
        if (authUser.role === roles.admin) {
          next();
          authorized = true;
        }

        // operator
        if (
          authUser.role === roles.operator &&
          accessMap[modelAccess.operator] >= accessMap[requiredAccess]
        ) {
          next();
          authorized = true;
        }

        // everyone
        if (
          authUser.role === roles.user &&
          accessMap[modelAccess.user] >= accessMap[requiredAccess]
        ) {
          next();
          authorized = true;
        }

        // self
        if (
          authUser.role === roles.user &&
          !authorized &&
          accessMap[modelAccess.self] >= accessMap[requiredAccess]
        ) {
          // ownership checking
          if (req.params && req.params[`${modelName}Id`]) {
            const itemId = req.params[`${modelName}Id`];
            const item = await Item.findOne({ _id: itemId });
            if (item && item.owner && item.owner === authUser.id) {
              next();
              authorized = true;
            }
          }
        }
      } else {
        // not authed
        statusCode = 401;
      }
    }

    if (!authorized) {
      res.status(statusCode).send(statusCode === 401 ? 'Unauthorized' : 'Forbidden');
    }
  });
