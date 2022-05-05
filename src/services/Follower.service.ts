import { Context, Next } from 'koa';
import { PipelineStage } from 'mongoose';
import { MHttpError } from '../common/constants';
import mongoose from '../db';

import BaseService from '../lib/BaseService';
import { NullableId } from '../lib/types';
import { jwtAuth } from '../middleware/authHandler.middleware';
import Follower from '../models/follower';
import User from '../models/user';
import { getPagenation, getServiceMainUrl } from '../utils/utils';
import { NPFollower } from './types';


class ServerFollower extends BaseService {
  /**
  * @api {post} /api/v1/serverUser create User
  * @apiDescription api description
  * @apiName /api/v1/serverUser restful:create
  * @apiGroup User
  * @apiVersion v1.0.0
  * @apiHeader {String} authorization user request token
  *
  * @apiParam {Context} ctx koa context, this param server call must be passed in
  * @apiParam {Next} next koa Next, this param server call must be passed in
  * @apiParam {Object} data (NPUsers.IUser)
  * @apiParam {String} name user name, to verify unique
  * @apiParam {String} password user password
  * @apiParam {String} dob date of birth
  * @apiParam {String} address? user address
  * @apiParam {String} description? user description
  *
  * @apiSuccess {Number} code success code
  * @apiSuccess {String} message msg info
  * @apiSuccess {json} data user follower data
  * @apiError {Date} timestamp success respone time
  *
  * @apiError {Error} code error code
  * @apiError {Error} message error code
  * @apiError {Date} timestamp error respone time
  *
  * @apiSuccessExample {json} Success-Response:
  *
  *{
    "code": 200,
    "message": "success",
    "data": {
      "_id": "6272d45af77ea9611f33a097",
      "starUserId": "626fcfb17ec4e3ff83313f97",
      "fansUserId": "626fd03295033bef455c4b81",
      "isFollowing": "Y",
      "createdAt": "2022-05-04T19:30:34.293Z",
      "updatedAt": "2022-05-04T19:30:34.293Z"
    },
    "timestamp": "2022-05-05 04:55:37"
  }
  * @apiErrorExample {json} Error-Response:
  * {
      "code": 405,
      "message": " method is not allowed",
      "timestamp": "2022-04-25 20:51:44"
    }
    {
      "code": 406,
      "message": "arg `starUserId` is required",
      "timestamp": "2022-04-26 20:51:44"
    }
    {
      "code": 406,
      "message": "arg `fansUserId` is required",
      "timestamp": "2022-04-26 20:51:44"
    }
  *
  */
  async create(ctx: Context, next: Next, data: NPFollower.IFollower): Promise<any> {
    // dev enviment to create admin
    const jwtAuthRes = await jwtAuth(ctx, next);
    if (!jwtAuthRes || !jwtAuthRes.id) {
      return;
    }
    // pass jwt auth
    // verify data
    const err = ctx.verifyData(data, ['starUserId', 'fansUserId']);
    if (err) {
      ctx.errorResult(err);
      return;
    }
    const { starUserId, fansUserId } = data;
    if (starUserId === fansUserId) {
      ctx.errorResult(MHttpError.ERROR_PARAMS_ERROR());
      return;
    }
    // verify star User
    const starUser = await User.findById(starUserId);
    if (!starUser || starUser.isDeleted !== 'N') {
      ctx.errorResult(MHttpError.ERROR_PARAMS_ERROR('starUserId is not a valid'));
      return;
    }
    // verify fans User
    const funsUser = await User.findById(fansUserId);
    if (!funsUser || funsUser.isDeleted !== 'N') {
      ctx.errorResult(MHttpError.ERROR_PARAMS_ERROR('fansUserId is not a valid'));
      return;
    }
    const followerSaved = await Follower.findOne({ starUserId, fansUserId }, { __v: 0 });
    // follower data is saved
    if (followerSaved) {
      if (followerSaved.isFollowing === 'Y') {
        ctx.successResult(followerSaved);
      } else {
        const updatedRes = await Follower.findByIdAndUpdate(followerSaved.id, { isFollowing: 'Y' }).exec();
        ctx.successResult(updatedRes);
      }
    } else {
      // create follower data
      let res = await new Follower({ starUserId, fansUserId }).save();
      if (res && res._id) {
        res = ctx.lo.omit(res.toJSON(), ['__v']);
        ctx.successResult(res);
      } else {
        ctx.errorResult( MHttpError.ERROR_SERVER_ERROR());
      }
    }
  }
  /**
  * @api {get} /api/v1/serverFollower find User follower data list by pagenation
  * @apiDescription api description
  * @apiName /api/v1/serverFollower restful:find
  * @apiGroup LoginLog
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
  * @apiSuccess {json} data user data
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
        "_id": "6272d454f77ea9611f33a093",
        "starUserId": "626e4a7cc0ce5cc9b6f0c1ad",
        "fansUserId": "626fd03295033bef455c4b81",
        "isFollowing": "Y",
        "starUser": {
          "name": "test01",
          "description": "good man"
        },
        "fansUser": {
          "name": "5e75a2",
          "description": "good man03"
        }
      },
      {
        "_id": "6272d45af77ea9611f33a097",
        "starUserId": "626fcfb17ec4e3ff83313f97",
        "fansUserId": "626fd03295033bef455c4b81",
        "isFollowing": "Y",
        "starUser": {
          "name": "7969ca",
          "description": "good man03"
        },
        "fansUser": {
          "name": "5e75a2",
          "description": "good man03"
        }
      }
    ],
    "timestamp": "2022-05-05 04:53:55",
    "total": 2,
    "limit": 1,
    "skip": 1
  }
  *
  * @apiErrorExample {json} Error-Response:
  * {
    "code": 401,
    "message": " unauthorized",
    "timestamp": "2022-04-27 19:28:29"
  }{
    "code": 404,
    "message": " not found"
  }
  *
  */
  async find(ctx: Context, next: Next, params?: any): Promise<any> {
    const jwtAuthRes = await jwtAuth(ctx, next);
    if (!jwtAuthRes || !jwtAuthRes.id) {
      return;
    }
    const { starUserId, fansUserId, isFollowing = 'Y' } = params;
    // pagenation args
    const { limit, skip } = getPagenation(params);
    let mFilter: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'starUserId',
          foreignField: '_id',
          as: 'starUser'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'fansUserId',
          foreignField: '_id',
          as: 'fansUser'
        }
      },
      {
        $match: {
          'starUser.isDeleted': 'N',
          'fansUser.isDeleted': 'N',
          isFollowing,
        }
      },
      // select fields
      {
        $project: {
          starUserId: 1,
          'starUser.name': 1,
          'starUser.description': 1,
          fansUserId: 1,
          'fansUser.name': 1,
          'fansUser.description': 1,
          isFollowing: 1,
        },
      },
      // expand [{}] => {}
      {
        $unwind: '$starUser'
      },
      {
        $unwind: '$fansUser'
      },
      {
        $sort: {
          updatedAt: -1
        }
      },
    ];
    // add match query
    starUserId && (mFilter.push({
      $match: {
        'starUserId': new mongoose.Types.ObjectId(starUserId),
      }
    }));
    fansUserId && (mFilter.push({
      $match: {
        'fansUserId': new mongoose.Types.ObjectId(fansUserId),
      }
    }));

    const query = Follower.aggregate(mFilter);

    mFilter.push({
      $group: {
        _id: '_id',
        total: {
          $sum: '_id'
        }
      }
    });
    const totalRes = await query;
    mFilter.pop();
    mFilter = mFilter.concat([{
      $limit: limit
    }, {
      $skip: skip
    }]);
    const data = await query;
    const res = {
      total: totalRes.length,
      limit,
      skip,
      data
    };
    ctx.successResult(res);
  }

  /**
  * @api {delete} /api/v1/serverFollower/:id delete User follower by id, tag delete
  * @apiDescription api description
  * @apiName /api/v1/serverFollower restful:remove
  * @apiGroup User
  * @apiVersion v1.0.0
  * @apiHeader {String} authorization user request token
  *
  * @apiParam {Context} ctx koa context, this param server call must be passed in
  * @apiParam {Next} next koa Next, this param server call must be passed in
  * @apiParam {number} id user id
  * @apiParam {Object} data (NPUsers.IUser)
  * @apiParam {Object} params? query objcet
  * @apiParam {String} name user name, to verify unique
  * @apiParam {String} dob date of birth
  * @apiParam {String} address? user address
  * @apiParam {String} description? user description
  *
  * @apiSuccess {Number} code success code
  * @apiSuccess {String} message msg info
  * @apiSuccess {json} data delete result
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
    "isDeleted": true
  },
    "timestamp": "2022-04-27 00:17:35"
  }
  *
  * @apiErrorExample {json} Error-Response:
  * {
    "code": 401,
    "message": " unauthorized",
    "timestamp": "2022-04-27 09:28:29"
  }
  {
    "code": 405,
    "message": " method is not allowed",
    "timestamp": "2022-04-25 20:51:44"
  }
  {
    "code": 406,
    "message": " params is error"
  }
  *
  */
  async remove(ctx: Context, next: Next, id: NullableId, params?: any): Promise<any> {
    const jwtAuthRes = await jwtAuth(ctx, next);
    if (!jwtAuthRes || !jwtAuthRes.id) {
      return;
    }
    let deletedData;
    // check the data whether already deleted or not found
    try {
      deletedData = await Follower.findOne({
        _id: id
      });
    } catch (error) {}
    if (!deletedData) {
      ctx.errorResult(MHttpError.ERROR_NOT_FOUND());
      return;
    } else if (deletedData.isFollowing === 'N'){
      ctx.successResult({ isDeleted: true });
    } else {
      const res = await Follower.findByIdAndUpdate(id, { isFollowing: 'N' }).exec();
      // delete success and no longer to return all data
      if (res && res.id) {
        ctx.successResult({ isDeleted: true });
      } else {
        ctx.errorResult( MHttpError.ERROR_OPERATE_FIAL());
      }
    }
  }
}

export default (): ServerFollower => {
  // init serverFollower
  const serverFollower = new ServerFollower(Follower, 'ServerFollower', getServiceMainUrl('serverFollower'));
  return serverFollower;
};
