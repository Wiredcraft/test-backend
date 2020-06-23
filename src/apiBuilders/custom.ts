import express, { Request, Response, Router } from 'express';
import { param } from 'express-validator';
import { getDistance } from 'geolib';
import mongoose from 'mongoose';

import authorize from '../auth/authorize';
import { AccessType } from '../models/access';
import User, { Roles } from '../models/user';
import validate from '../util/apiValidator';
import { errorHandler } from '../util/errorHandler';
import { getLogger } from '../util/logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

/**
 * Custom routers
 */
export const getCustomRouters = async (): Promise<Router[]> => {
  const customRouters: Router[] = [];

  // followers
  const followersRouter = express.Router();
  followersRouter.route('/user/followers/').get(
    authorize('user', AccessType.readOnly),
    errorHandler(async (req: Request, res: Response) => {
      // TODO: Implement following/followers logic
    })
  );
  customRouters.push(followersRouter);

  // nearby users
  const nearbyRouter = express.Router();
  nearbyRouter.route('/user/nearby/:username/:quantity').get(
    validate([
      param('username')
        .exists()
        .withMessage('username required')
        .custom(async (username) => {
          const user = await User.findOne({ name: username });
          if (!user) {
            throw Error('user does not exist.');
          }
        }),
      param('quantity').optional().isNumeric().withMessage('quantity must be a number'),
    ]),
    authorize('user', AccessType.readOnly),
    errorHandler(async (req: Request, res: Response) => {
      const { username, quantity } = req.param as any;
      const targetUser = await User.findOne({ name: username }).select(
        'name latitude longitude -_id'
      );
      const allUsers = await User.find({}).select('name latitude longitude -_id');
      if (targetUser && allUsers && allUsers.length > 0) {
        const nearbyUsers = allUsers
          .sort(
            (u1, u2) =>
              getDistance(
                { latitude: targetUser.latitude, longitude: targetUser.longitude },
                { latitude: u1.latitude, longitude: u1.longitude }
              ) -
              getDistance(
                { latitude: targetUser.latitude, longitude: targetUser.longitude },
                { latitude: u2.latitude, longitude: u2.longitude }
              )
          )
          .slice(0, quantity ?? 10)
          .map((u) => u.name);
        res.status(200).json(nearbyUsers);
      } else {
        res.status(204).end();
      }
    })
  );
  return customRouters;
};
