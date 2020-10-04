import * as Koa from "koa";
import * as Joi from "@hapi/joi";

import {validateWithJoi} from "../utility/Utility";
import {responseError, responseNormal} from "../router/Router";
import * as UserLinkDao from "../dao/UserLink";
import {UserSchemaId} from "./User";
import * as UserDao from "../dao/User";

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// TAG
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @swagger
 * tags:
 *   name: UserLink
 *   description: User relations related APIs
 */

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// REQUESTS
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @swagger
 * definitions:
 *   RelationRequest:
 *     type: object
 *     properties:
 *       userId:
 *         type: string
 *         description: user id, shall be a string of uuid v4, length limit 36
 *         example: "29256e52-9ca2-49d5-8b4e-f42578ccae68"
 *       targetId:
 *         type: string
 *         description: user id, shall be a string of uuid v4, length limit 36
 *         example: "29256e52-9ca2-49d5-8b4e-f42578ccae68"
 */

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// RESPONSES
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @swagger
 * definitions:
 *   RelationResponse:
 *     type: object
 *     properties:
 *       code:
 *         type: integer
 *         format: int32
 *         example: 200
 *       data:
 *         type: array
 *         items:
 *           type: string
 *           description: user id, shall be a string of uuid v4, length limit 36
 *           example: "29256e52-9ca2-49d5-8b4e-f42578ccae68"
 */

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// JOI SCHEMAS
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
const RelationRequestSchema = Joi.object({
  userId: UserSchemaId,
  targetId: UserSchemaId,
});

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// APIS
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @swagger
 * /userlink/follow:
 *   post:
 *     tags:
 *       - UserLink
 *     description: follow a user
 *     operationId: followUser
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: relation request
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RelationRequest'
 *     responses:
 *       200:
 *         description: request processed without error
 *         schema:
 *           $ref: '#/definitions/OkResponse'
 */
export const followUser = async (ctx: Koa.Context) => {
  const body = (ctx.request as any).body as { userId: string, targetId: string };
  const {error} = await validateWithJoi(RelationRequestSchema, body);
  if (error) {
    return responseError("UserLinkController", "followUser", ctx, -1, error);
  }

  try {
    const user = await UserDao.getUser(body.userId);
    if (user === null) {
      return responseError("UserLinkController", "followUser", ctx, -1, new Error(`User ${body.userId} not found`));
    }
    const target = await UserDao.getUser(body.targetId);
    if (target === null) {
      return responseError("UserLinkController", "followUser", ctx, -1, new Error(`Target ${body.targetId} not found`));
    }

    await UserLinkDao.followUser(body.userId, body.targetId);

    return responseNormal("UserLinkController", "followUser", ctx, "OK");
  } catch (err) {
    return responseError("UserLinkController", "followUser", ctx, -1, err);
  }
};

/**
 * @swagger
 * /userlink/unfollow:
 *   post:
 *     tags:
 *       - UserLink
 *     description: unfollow a user
 *     operationId: unfollowUser
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: relation request
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RelationRequest'
 *     responses:
 *       200:
 *         description: request processed without error
 *         schema:
 *           $ref: '#/definitions/OkResponse'
 */
export const unfollowUser = async (ctx: Koa.Context) => {
  const body = (ctx.request as any).body as { userId: string, targetId: string };
  const {error} = await validateWithJoi(RelationRequestSchema, body);
  if (error) {
    return responseError("UserLinkController", "unfollowUser", ctx, -1, error);
  }

  try {
    const user = await UserDao.getUser(body.userId);
    if (user === null) {
      return responseError("UserLinkController", "followUser", ctx, -1, new Error(`User ${body.userId} not found`));
    }
    const target = await UserDao.getUser(body.targetId);
    if (target === null) {
      return responseError("UserLinkController", "followUser", ctx, -1, new Error(`Target ${body.targetId} not found`));
    }

    await UserLinkDao.unfollowUser(body.userId, body.targetId);

    return responseNormal("UserLinkController", "unfollowUser", ctx, "OK");
  } catch (err) {
    return responseError("UserLinkController", "unfollowUser", ctx, -1, err);
  }
};

/**
 * @swagger
 * /userlink/follower/{id}:
 *   get:
 *     tags:
 *       - UserLink
 *     description: get the followers list of user
 *     operationId: getFollowers
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
 *         description: user id list
 *         schema:
 *           $ref: '#/definitions/RelationResponse'
 */
export const getFollowers = async (ctx: Koa.Context) => {
  const {error} = await validateWithJoi(UserSchemaId, ctx.params.id);
  if (error) {
    return responseError("UserLinkController", "getFollowers", ctx, -1, error);
  }

  try {
    const list = await UserLinkDao.getFollowers(ctx.params.id);

    return responseNormal("UserLinkController", "getFollowers", ctx, list);
  } catch (err) {
    return responseError("UserLinkController", "getFollowers", ctx, -1, err);
  }
};

/**
 * @swagger
 * /userlink/following/{id}:
 *   get:
 *     tags:
 *       - UserLink
 *     description: get the following list of user
 *     operationId: getFollowings
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
 *         description: user id list
 *         schema:
 *           $ref: '#/definitions/RelationResponse'
 */
export const getFollowings = async (ctx: Koa.Context) => {
  const {error} = await validateWithJoi(UserSchemaId, ctx.params.id);
  if (error) {
    return responseError("UserLinkController", "getFollowings", ctx, -1, error);
  }

  try {
    const list = await UserLinkDao.getFollowing(ctx.params.id);

    return responseNormal("UserLinkController", "getFollowings", ctx, list);
  } catch (err) {
    return responseError("UserLinkController", "getFollowings", ctx, -1, err);
  }
};
