import { Context, Next } from 'koa';
import { uniqWith } from 'lodash';
import { MHttpError } from '../common/constants';
import mongoose from '../db';

import BaseService from '../lib/BaseService';
import { jwtAuth } from '../middleware/authHandler.middleware';
import Location from '../models/location';
import { getPagenation, getServiceMainUrl, verifyLngLat } from '../utils/utils';
import { NPLocation } from './types';

const uniqWithUserIdLoc = (data: any[]) => {
  return uniqWith(data.filter(item => item.userId), (a: any, b: any) => a.userId === b.userId && JSON.stringify(a.loc) === JSON.stringify(b.loc));
};

class ServerLocation extends BaseService {
  /**
  * @api {post} /api/v1/serverLocation create user location
  * @apiDescription api description
  * @apiName /api/v1/serverLocation restful:create
  * @apiGroup Location
  * @apiVersion v1.0.0
  * @apiHeader {String} authorization user request token
  *
  * @apiParam {Context} ctx koa context, this param server call must be passed in
  * @apiParam {Next} next koa Next, this param server call must be passed in
  * @apiParam {Object} data (NPLocation.ILocation)
  * @apiParam {String} userId user id
  * @apiParam {String} loc location geo object
  *
  * @apiSuccess {Number} code success code
  * @apiSuccess {String} message msg info
  * @apiSuccess {json} data location data
  * @apiError {Date} timestamp success respone time
  *
  * @apiError {Error} code error code
  * @apiError {Error} message error code
  * @apiError {Date} timestamp error respone time
  *
  * @apiSuccessExample {json} Success-Response:
  * {
    "code": 200,
    "message": "success",
    "data": {
      "userId": "626fce46d817baede2ae3918",
      "loc": {
        "type": "Point",
        "coordinates": [
          110,
          40
        ]
      },
      "_id": "6272e7003b74ed9636ea12be",
      "createdAt": "2022-05-04T20:50:08.060Z",
      "updatedAt": "2022-05-04T20:50:08.060Z"
    },
    "timestamp": "2022-05-05 04:50:08"
  }
  *
  * @apiErrorExample {json} Error-Response:
  * {
      "code": 405,
      "message": " method is not allowed",
      "timestamp": "2022-04-25 20:51:44"
    }
    {
      "code": 406,
      "message": "arg `userId` is required",
      "timestamp": "2022-05-02 20:51:44"
    }
  *
  */
  async create(ctx: Context, next: Next, data: NPLocation.ILocation): Promise<any> {
    // dev enviment to create admin
    const jwtAuthRes = await jwtAuth(ctx, next);
    if (!jwtAuthRes || !jwtAuthRes.id) {
      return;
    }
    // pass jwt auth
    // verify data
    const err = ctx.verifyData(data, ['userId', 'loc']);
    if (err) {
      ctx.errorResult(err);
      return;
    }

    const { userId, loc: [lng, lat]  } = data;
    if (!verifyLngLat([lng, lat])) {
      ctx.errorResult( MHttpError.ERROR_PARAMS_ERROR('loc is not valid'));
    }
    const mLoc = { type: 'Point', coordinates: [lng, lat]};
    // create follower data
    let res = await Location.create({ userId, loc: mLoc });
    if (res && res._id) {
      res = ctx.lo.omit(res.toJSON(), ['__v']);
      ctx.successResult(res);
    } else {
      ctx.errorResult( MHttpError.ERROR_SERVER_ERROR());
    }
  }
  /**
  * @api {get} /api/v1/serverLocation find User location data list by pagenation
  * @apiDescription api description
  * @apiName /api/v1/serverLocation restful:find
  * @apiGroup Location
  * @apiVersion v1.0.0
  * @apiHeader {String} authorization user request token
  *
  * @apiParam {Context} ctx koa context, this param server call must be passed in
  * @apiParam {Next} next koa Next, this param server call must be passed in
  * @apiParam {String} userId? user id
  * @apiParam {String} ip? user login ip
  *
  * @apiSuccess {Number} code success code
  * @apiSuccess {String} message msg info
  * @apiSuccess {json} data user and location data
  * @apiError {Date} timestamp success respone time
  *
  * @apiError {Error} code error code
  * @apiError {Error} message error code
  * @apiError {Date} timestamp error respone time
  *
  * @apiSuccessExample {json} Success-Response:
  *{
    "code": 200,
    "message": "success",
    "data": [
      {
        "loc": {
          "type": "Point",
          "coordinates": [
            110,
            40
          ]
        },
        "_id": "6272869c19c7c1c76dd9ac8f",
        "userId": {
          "_id": "626fd03295033bef455c4b81",
          "name": "5e75a2"
        },
        "updatedAt": "2022-05-04T13:58:52.298Z"
      },
      {
        "loc": {
          "type": "Point",
          "coordinates": [
            110,
            40
          ]
        },
        "_id": "6272e300bdcd3432be8189a8",
        "userId": {
          "_id": "626fcfb17ec4e3ff83313f97",
          "name": "7969ca"
        },
        "updatedAt": "2022-05-04T20:33:04.898Z"
      }
    ],
    "timestamp": "2022-05-05 04:41:53",
    "total": 2,
    "limit": 10,
    "skip": 0
  }
  *
  * @apiErrorExample {json} Error-Response:
  * {
    "code": 401,
    "message": " unauthorized",
    "timestamp": "2022-04-27 19:28:29"
  }
  {
    "code": 406,
    "message": "the `data` is required",
    "timestamp": "2022-05-05 04:46:18"
  }
  *
  */

  async find(ctx: Context, next: Next, params?: any): Promise<any> {
    const jwtAuthRes = await jwtAuth(ctx, next);
    console.log('jwtAuthRes',jwtAuthRes);
    if (!jwtAuthRes || !jwtAuthRes.id) {
      return;
    }
    // earth 1 angle = 111.12 km
    const distanceConver = 111120;
    // query objcet
    const queryObj: any = { };
    const { userId, loc, maxDistance } = params;
    userId && (queryObj.userId = userId);
    const err = ctx.verifyData(params, 'loc');
    if (err) {
      ctx.errorResult(err);
      return;
    }
    if (loc) {
      let [lng, lat] = loc;
      try {
        if (typeof loc === 'string') {
          [lng, lat] = JSON.parse(loc);
        }
      } catch (error) {
        console.log('serverLocation find error:', error);
        ctx.errorResult(MHttpError.ERROR_PARAMS_ERROR('loc is not valid json'));
      }
      const mMaxDistance = maxDistance ? (maxDistance / distanceConver) : 1000 / distanceConver;
      if (lng && lat) {
        const query = Location.find(queryObj, { _id: 1, name: 1, updatedAt: 1   })
          .select('loc updatedAt -__v')
          .where('loc')
          .within()
          .circle({
            center: [Number(lng), Number(lat)],
            radius: mMaxDistance,
            spherical: true,
          })
          .populate('userId', '_id name userId', 'User', { isDeleted: 'N' });
        // count uniq data
        const total = uniqWithUserIdLoc(await query.clone()).length;
        // pagenation args
        const { limit, skip } = getPagenation(params);
        const qRes = await query
          .limit(limit)
          .skip(skip);
        const data = uniqWithUserIdLoc(qRes);
        const res = {
          total,
          limit,
          skip,
          data
        };
        ctx.successResult(res);
      }
    }
  }
}

export default (): ServerLocation => {
  // init serverLocation
  const serverLocation = new ServerLocation(Location, 'ServerLocation', getServiceMainUrl('serverLocation'));
  return serverLocation;
};
