import * as Koa from "koa";
import * as Joi from "@hapi/joi";

import {validateWithJoi} from "../utility/Utility";
import {responseError, responseNormal} from "../router/Router";
import {UserGeo as UserGeoModel} from "../model/UserGeo";
import * as UserGeoDao from "../dao/UserGeo";
import {UserSchemaId} from "./User";
import * as UserLinkDao from "../dao/UserLink";

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// TAG
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @swagger
 * tags:
 *   name: UserGeo
 *   description: User geo related APIs
 */

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// RESPONSES
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @swagger
 * definitions:
 *   NearbyResponse:
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
const UserGeoSchema = Joi.object({
  id: UserSchemaId,
  longitude: Joi.number().min(-180).max(180).required(),
  latitude: Joi.number().min(-85.05112878).max(85.05112878).required(),
});

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// APIS
// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
/**
 * @swagger
 * /usergeo:
 *   post:
 *     tags:
 *       - UserGeo
 *     description: save user geo data, if data not exists it would be created, if exists then updated
 *     operationId: saveUserGeo
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: user geo data
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserGeo'
 *     responses:
 *       200:
 *         description: request processed without error
 *         schema:
 *           $ref: '#/definitions/OkResponse'
 */
export const saveUserGeo = async (ctx: Koa.Context) => {
  const body = (ctx.request as any).body as UserGeoModel;
  const {error} = await validateWithJoi(UserGeoSchema, body);
  if (error) {
    return responseError("UserGeoController", "saveUserGeo", ctx, -1, error);
  }

  try {
    await UserGeoDao.saveUserGeo(body);

    return responseNormal("UserGeoController", "saveUserGeo", ctx, "OK");
  } catch (err) {
    return responseError("UserGeoController", "saveUserGeo", ctx, -1, err);
  }
};

/**
 * @swagger
 * /usergeo/nearby/{id}:
 *   get:
 *     tags:
 *       - UserGeo
 *     description: get nearby user ids by target userId
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
 *           $ref: '#/definitions/NearbyResponse'
 */
export const getNearbyUserIds = async (ctx: Koa.Context) => {
  const {error} = await validateWithJoi(UserSchemaId, ctx.params.id);
  if (error) {
    return responseError("UserGeoController", "getNearbyUserIds", ctx, -1, error);
  }

  try {
    const result = [] as string[];
    const followers = await UserLinkDao.getFollowers(ctx.params.id);
    const nearbyIds = await UserGeoDao.getNearbyUserIds(ctx.params.id);

    for (const [, id] of nearbyIds.entries()) {
      if (id !== ctx.params.id // userId self would be returned by redis, so shall be filtered here
        && followers.indexOf(id) !== -1) { // only user's "friends" (follower, since it's passive action) shall be displayed
        result.push(id);
      }
    }

    return responseNormal("UserGeoController", "getNearbyUserIds", ctx, result);
  } catch (err) {
    return responseError("UserGeoController", "getNearbyUserIds", ctx, -1, err);
  }
};
