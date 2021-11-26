// routers/nearby.js
import express from 'express';
import { validator, validation, findInBoundary } from '../services/nearby';

const router = express.Router();

/**
 * @swagger
 * /api/v1/nearby/:
 *   get:
 *     summary: Retrieve a list of members whose are nearby a assigned point
 *     parameters:
 *       - in: query
 *         name: distance
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100000
 *           default: 500
 *         description: The radius of search, in meter, 1 to 100000. You could try 500, 1600, 2000, 10000.
 *       - in: query
 *         name: long
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *           default: 121.468023
 *         description: Longitude of current position, -180 to 180.
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *           default: 31.205885
 *         description: Longitude of current position, -90 to 90.
 *     responses:
 *       200:
 *         description: A member list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The member ID.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the member .
 *                     example: Jack
 *                   location:
 *                     type: string
 *                     description: The location of the member, in geometric WKT(Well know text).
 *                     example: POINT(121.461966 31.220272)
 *                   distance:
 *                     type: integer
 *                     description: distance from assigned point, in meter.
 *                     example: 460
 */
router.get('/', validator, validation, findInBoundary);

export default router;
