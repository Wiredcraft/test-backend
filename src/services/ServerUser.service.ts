import KoaRouter from '@koa/router';
import { Context, Next } from 'koa';
import BaseService from '../lib/BaseService';
import { Id, NullableId } from '../lib/types';
import { MHttpError } from '../common/constants';
import User from '../models/user';
import { hashPwd } from '../utils/mcrypto';
import { NPUsers } from './types';
import { getServiceMainUrl } from '../utils/utils';
import { jwtAuth } from '../middleware/authHandler.middleware';

class ServerUser extends BaseService {
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
  * @apiSuccess {json} data user data
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
    "id": "6268fa702f7f6453a938466c"
    "name": "test09",
    "dob": "1998-05-14T00:00:00.000Z",
    "address": "shanghai",
    "description": "good man05",
    "isDeleted": "N",
    "createdAt": "2022-04-25T08:10:24.769Z",
    "updatedAt": "2022-04-25T08:10:24.771Z",
  },
    "timestamp": "2022-04-25 1:10:24"
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
      "message": "arg `name` is required",
      "timestamp": "2022-04-26 20:51:44"
    }
    {
      "code": 500,
      "message": " server error",
      "timestamp": "2022-04-26 18:06:48"
    }
    {
      "code": 10002,
      "message": "name already exists",
      "timestamp": "2022-04-26 18:53:40"
    }
  *
  */
  async create(ctx: Context, next: Next, data: NPUsers.IUser): Promise<any> {
    // dev enviment to create admin
    if (!ctx.__isDev || data.name !== 'admin') {
      const jwtAuthRes = await jwtAuth(ctx, next);
      if (!jwtAuthRes || !jwtAuthRes.id) {
        return;
      }
    }
    // pass jwt auth
    // verify data
    const err = ctx.verifyData(data, ['name', 'password', 'dob']);
    if (err) {
      ctx.errorResult(err);
      return;
    }
    const { name, password, dob, address, description } = data;
    const nameSaved = await User.findOne({ name });
    // limit user creat by name
    if (nameSaved) {
      ctx.errorResult(MHttpError.ERROR_DATA_ALREADY_EXISTS('name already exists'));
    } else {
      let mHashPwd = '';
      if (password) {
        mHashPwd = await hashPwd(password);
      }
      const userData: any = {
        name,
        password: mHashPwd,
        dob,
      };
      address && (userData.address = address);
      description && (userData.description = description);
      const user = new User(userData);
      let res = await user.save();
      // omit the password, __v fields
      if (res && res._id) {
        res = ctx.lo.omit(res.toJSON(), ['password', '__v']);
        ctx.successResult(res);
      } else {
        ctx.errorResult( MHttpError.ERROR_SERVER_ERROR());
      }
    }
  }

  /**
  * @api {get} /api/v1/serverUser/:id get User by id
  * @apiDescription api description
  * @apiName /api/v1/serverUser restful:get
  * @apiGroup User
  * @apiVersion v1.0.0
  * @apiHeader {String} authorization user request token
  *
  * @apiParam {Context} ctx koa context, this param server call must be passed in
  * @apiParam {Next} next koa Next, this param server call must be passed in
  * @apiParam {number} id user id
  * @apiParam {Object} params? query objcet
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
  * {
    "code": 200,
    "message": "success",
    "data": {
    "_id": "62679e03259bb2f1d69a0849",
    "name": "test05",
    "dob": "1998-05-11T00:00:00.000Z",
    "address": "shanghai",
    "description": "good man5",
    "createdAt": "2022-04-26T07:23:47.426Z",
    "updatedAt": "2022-04-26T07:23:47.429Z",
    "id": "62679e03259bb2f1d69a084a"
  },
    "timestamp": "2022-04-26 15:30:54"
  }
  *
  * @apiErrorExample {json} Error-Response:
  * {
    "code": 404,
    "message": " not found",
    "timestamp": "2022-04-26 23:49:23"
  }
  {
    "code": 405,
    "message": " method is not allowed",
    "timestamp": "2022-04-25 20:51:44"
  }
  *
  */
  async get(ctx: Context, next: Next, id: Id, params?: any): Promise<any> {
    const jwtAuthRes = await jwtAuth(ctx, next);
    if (!jwtAuthRes || !jwtAuthRes.id) {
      return;
    }
    // find data and omit some fields
    // 'id name dob address description createdAt updatedAt'
    try {
      const res = await User.findById(id, { password: 0, __v: 0 });
      if (res && res.id && res.isDeleted === 'N') {
        ctx.successResult(res);
      } else {
        ctx.errorResult( MHttpError.ERROR_NOT_FOUND());
      }
    } catch (error) {
      ctx.errorResult( MHttpError.ERROR_NOT_FOUND());
    }
  }

  /**
  * @api {put} /api/v1/serverUser/:id update User by id
  * @apiDescription api description
  * @apiName /api/v1/serverUser restful:update
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
  * @apiSuccess {json} data user data
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
    "_id": "62679e03259bb2f1d69a0849",
    "name": "test05",
    "dob": "1998-05-11T00:00:00.000Z",
    "address": "shanghai",
    "description": "good man5",
    "createdAt": "2022-04-26T07:23:47.426Z",
    "updatedAt": "2022-04-26T07:23:47.429Z",
    "id": "62679e03259bb2f1d69a084a"
  },
    "timestamp": "2022-04-26 15:30:54"
  }
  *
  * @apiErrorExample {json} Error-Response:
  {
    "code": 405,
    "message": " method is not allowed",
    "timestamp": "2022-04-25 20:51:44"
  }
  {
    "code": 406,
    "message": " params is error"
  }
  {
    "code": 10002,
    "message": "name already exists",
    "timestamp": "2022-04-25 21:14:52"
  }
  *
  */
  async update(ctx: Context, next: Next, id: NullableId, data: NPUsers.IUser, params?: any): Promise<any> {
    await this.patch(ctx, next, id, data, params);
  }

  /**
  * @api {delete} /api/v1/serverUser/:id delete User by id, tag delete
  * @apiDescription api description
  * @apiName /api/v1/serverUser restful:remove
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
  * @apiSuccess {json} data user data
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
    let usedData;
    // check the data whether already deleted or not found
    try {
      usedData = await User.findOne({
        _id: id,
        isDeleted: 'N'
      });
    } catch (error) {}
    if (!usedData) {
      ctx.errorResult( MHttpError.ERROR_NOT_FOUND());
      return;
    }
    const res = await User.findByIdAndUpdate(id, { isDeleted: 'Y' }).exec();
    // delete success and no longer to return all data
    if (res && res.id) {
      ctx.successResult({ isDeleted: true });
    } else {
      ctx.errorResult( MHttpError.ERROR_OPERATE_FIAL());
    }
  }

  /**
  * @api {get} /api/v1/serverUser find User list by pagenation
  * @apiDescription api description
  * @apiName /api/v1/serverUser restful:find
  * @apiGroup User
  * @apiVersion v1.0.0
  * @apiHeader {String} authorization user request token
  *
  * @apiParam {Context} ctx koa context, this param server call must be passed in
  * @apiParam {Next} next koa Next, this param server call must be passed in
  * @apiParam {number} id user id
  * @apiParam {Object} data (NPUsers.IUser)
  * @apiParam {Object} params query objcet
  * @apiParam {String} name? user name, to verify unique
  * @apiParam {String} dob date? of birth
  * @apiParam {String} address? user address
  * @apiParam {String} description? user description
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
  * {
    "code": 200,
    "message": "success",
    "data": [
    {
      "_id": "6267f7fd72c70834349c63ed",
      "name": "test05",
      "dob": "1998-05-12T00:00:00.000Z",
      "address": "shanghai",
      "description": "good man5",
      "createdAt": "2022-04-26T21:17:41.972Z",
      "updatedAt": "2022-04-26T21:17:41.986Z"
    },
    {
      "_id": "6267f7a86aaf844e2eb44ad9",
      "name": "test06",
      "dob": "1998-05-12T00:00:00.000Z",
      "address": "shanghai",
      "description": "good man6",
      "createdAt": "2022-04-26T20:46:16.495Z",
      "updatedAt": "2022-04-26T20:46:16.500Z"
    }
    ],
    "returnDate": "2022-04-26 22:37:52",
    "total": 3,
    "limit": "2",
    "skip": 0
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
  async find(ctx: Context, next: Next, params?: any): Promise<any> {
    const jwtAuthRes = await jwtAuth(ctx, next);
    if (!jwtAuthRes || !jwtAuthRes.id) {
      return;
    }
    const { name, address, description, pageSize, pageIndex } = params;
    const queryObj: any = {};
    name && (queryObj.name = name);
    // add vague query by address or description
    const vagueQuery = [];
    address && (vagueQuery.push({ address: { $regex: address } }));
    description && (vagueQuery.push({ description: { $regex: description } }));
    if (vagueQuery.length) {
      queryObj['$or'] = vagueQuery;
    }

    // get pagenation params,
    // tozap: export pagenation operation function
    const mLimit = pageSize || 10;
    const mPageIndex = pageIndex > 0 ? pageIndex - 1 : 0;
    const mSkip = (mPageIndex || 0) * mLimit;
    // get total
    const total = await User.count(queryObj);
    // get data
    const data = await User.find(queryObj, { password: 0, __v: 0 }, { sort: { createdAt: -1 }, limit: mLimit, skip: mSkip });
    const res = {
      total,
      limit: mLimit,
      skip: mSkip,
      data
    };
    ctx.successResult(res);
  }

  /**
  * @api {patch} /api/v1/serverUser/:id patch User by id
  * @apiDescription api description
  * @apiName /api/v1/serverUser restful:patch
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
  * @apiSuccess {json} data user data
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
    "_id": "62679e03259bb2f1d69a0849",
    "name": "test05",
    "dob": "1998-05-11T00:00:00.000Z",
    "address": "shanghai",
    "description": "good man5",
    "createdAt": "2022-04-26T13:23:47.426Z",
    "updatedAt": "2022-04-26T13:23:47.429Z",
    "id": "62679e03259bb2f1d69a084a"
  },
    "timestamp": "2022-04-26 21:30:54"
  }
  *
  * @apiErrorExample {json} Error-Response:
  {
    "code": 405,
    "message": " method is not allowed",
    "timestamp": "2022-04-25 20:51:44"
  }
  {
    "code": 406,
    "message": " params is error"
  }
  {
    "code": 10002,
    "message": "name already exists",
    "timestamp": "2022-04-25 21:14:52"
  }
  *
  */
  async patch(ctx: Context, next: Next, id: NullableId, data: NPUsers.IUser, params?: any): Promise<any> {
    const jwtAuthRes = await jwtAuth(ctx, next);
    if (!jwtAuthRes || !jwtAuthRes.id) {
      return;
    }
    const { name, dob, address, description } = data;
    const nData: any = {};
    let usedData;
    try {
      usedData = await User.findOne({
        _id: id,
        isDeleted: 'N'
      });
    } catch (error) {}
    if (!usedData) {
      ctx.errorResult(MHttpError.ERROR_NOT_FOUND());
      return;
    }
    // name is valid check whether it is used
    if (name) {
      const nameUsedData = await User.findOne({
        name,
        _id: { $ne: id },
        isDeleted: 'N'
      });
      // the name is used
      if (nameUsedData) {
        ctx.errorResult( MHttpError.ERROR_DATA_ALREADY_EXISTS('name already exists'));
        return;
      }
      nData.name = name;
    }
    dob !== undefined && (nData.dob = dob);
    address !== undefined && (nData.address = address);
    description !== undefined && (nData.description = description);
    // isDeleted !== undefined && (['N', 'Y'].includes(isDeleted)) && (nData.isDeleted = isDeleted);
    if (ctx.lo.isEmpty(nData)) {
      ctx.errorResult( MHttpError.ERROR_PARAMS_ERROR('do not have any verify data'));
      return;
    }
    await User.findOneAndUpdate({ _id: id, isDeleted: 'N' }, nData).exec();
    let res = await User.findById(id);
    // omit the password, __v fields
    res = ctx.lo.omit(res.toJSON(), ['password', '__v']);
    ctx.successResult(res);
  }

}


export default (): ServerUser => {
  // init ServerUser
  const serverUser = new ServerUser(User, 'ServerUser', getServiceMainUrl('serverUser'));
  return serverUser;
};
