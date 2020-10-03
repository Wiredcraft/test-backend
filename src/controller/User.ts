import * as Koa from "koa";
import * as Joi from "@hapi/joi";
import * as moment from "moment";
import * as uuid from "uuid";

import {validateWithJoi} from "../utility/Utility";
import {responseError, responseNormal} from "../router/Router";
import {User as UserModel} from "../model/User";
import * as UserDao from "../dao/User";

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// TAG
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User data related APIs
 */

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// RESPONSES
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @swagger
 * definitions:
 *   OkResponse:
 *     type: object
 *     properties:
 *       code:
 *         type: integer
 *         format: int32
 *         example: 200
 *       data:
 *         type: string
 *         example: "OK"
 *   UserResponse:
 *     type: object
 *     properties:
 *       code:
 *         type: integer
 *         format: int32
 *         example: 200
 *       data:
 *         $ref: '#/definitions/User'
 */

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// JOI SCHEMAS
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export const UserSchemaId = Joi.string().uuid({version: ["uuidv4"]}).required();
const UserSchema = Joi.object({
  name: Joi.string().min(1).max(36).required(),
  dob: Joi.number().integer().less(moment().unix()).sign("positive").required(),
  address: Joi.string().min(1).max(128).required(),
  description: Joi.string().min(1).max(256).required(),
  createdAt: Joi.number().integer().less(moment().unix()).sign("positive").required(),
});
const UserSchemaWithId = UserSchema.keys({
  id: UserSchemaId,
});

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// APIS
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     description: get user data by userId
 *     operationId: getUser
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: string
 *         example: "29256e52-9ca2-49d5-8b4e-f42578ccae68"
 *     responses:
 *       200:
 *         description: user data
 *         schema:
 *           $ref: '#/definitions/UserResponse'
 */
export const getUser = async (ctx: Koa.Context) => {
  const {error} = await validateWithJoi(UserSchemaId, ctx.params.id);
  if (error) {
    return responseError("UserController", "getUser", ctx, -1, error);
  }

  try {
    const user = await UserDao.getUser(ctx.params.id);

    return responseNormal("UserController", "getUser", ctx, user === null ? {} : user);
  } catch (err) {
    return responseError("UserController", "getUser", ctx, -1, err);
  }
};

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     description: create user data
 *     operationId: createUser
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: user data
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: user data
 *         schema:
 *           $ref: '#/definitions/UserResponse'
 */
export const createUser = async (ctx: Koa.Context) => {
  const body = (ctx.request as any).body as UserModel; // without id
  const {error} = await validateWithJoi(UserSchema, body);
  if (error) {
    return responseError("UserController", "createUser", ctx, -1, error);
  }

  try {
    const user = Object.assign({id: uuid.v4()}, body) as UserModel;
    await UserDao.createUser(user);

    return responseNormal("UserController", "createUser", ctx, user);
  } catch (err) {
    return responseError("UserController", "createUser", ctx, -1, err);
  }
};

/**
 * @swagger
 * /user:
 *   put:
 *     tags:
 *       - User
 *     description: update user data
 *     operationId: updateUser
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: user data
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: request processed without error
 *         schema:
 *           $ref: '#/definitions/OkResponse'
 */
export const updateUser = async (ctx: Koa.Context) => {
  const body = (ctx.request as any).body as UserModel;
  const {error} = await validateWithJoi(UserSchemaWithId, body);
  if (error) {
    return responseError("UserController", "updateUser", ctx, -1, error);
  }

  try {
    const ok = await UserDao.updateUser(body);

    return responseNormal("UserController", "updateUser", ctx, ok);
  } catch (err) {
    return responseError("UserController", "updateUser", ctx, -1, err);
  }
};

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     description: delete user data
 *     operationId: deleteUser
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: string
 *         example: "29256e52-9ca2-49d5-8b4e-f42578ccae68"
 *     responses:
 *       200:
 *         description: request processed without error
 *         schema:
 *           $ref: '#/definitions/OkResponse'
 */
export const deleteUser = async (ctx: Koa.Context) => {
  const {error} = await validateWithJoi(UserSchemaId, ctx.params.id);
  if (error) {
    return responseError("UserController", "deleteUser", ctx, -1, error);
  }

  try {
    const deletedCount = await UserDao.deleteUser(ctx.params.id);

    return responseNormal("UserController", "deleteUser", ctx, deletedCount > 0 ? "OK" : deletedCount);
  } catch (err) {
    return responseError("UserController", "deleteUser", ctx, -1, err);
  }
};
