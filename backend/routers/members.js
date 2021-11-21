// routers/members.js
import express from 'express';
import { list, getOne, create, update, destory } from '../services/members';

const router = express.Router();

/**
 * @swagger
 * /api/v1/members:
 *   get:
 *     summary: Retrieve a list of members
 *     description: Retrieve a list of members. Can be used to populate a list of fake members when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: Succeed.
 */
router.get('/', list /* here should has a middleware of pagination */);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   get:
 *     summary: Retrieve a single member.
 *     description: Retrieve a single member. Can be used to populate a member profile when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The member ID
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 1
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Jack
 *                     dob:
 *                       type: string
 *                       description: The user's birthday.
 *                       example: 2021-01-01
 *                     address:
 *                       type: object
 *                       description: The user's address with GeoJSON format.
 *                       example:
 *                         crs:
 *                           type: name
 *                           properties:
 *                             name: "EPSG:4326"
 *                         type: "Point"
 *                         coordinates:
 *                           - 121.461966
 *                           - 31.220272
 *                     description:
 *                       type: string
 *                       description: The user's description.
 *                       example: "cool guy"
 *                     createdAt:
 *                       type: datetime
 *                       description: Time for creation of the user.
 *                       example: "2021-11-21T02:27:31.546Z"
 */
router.get('/:id([0-9]+)', getOne);

/**
 * @swagger
 * /api/v1/members:
 *   post:
 *     summary: Create new member record into database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      # Request body contents
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *               address:
 *                 type: array
 *               description:
 *                 type: string
 *             example:   # Sample object
 *               name: Jessica Smith
 *               dob: "1968-03-02"
 *               address: [121.458715, 31.221061]
 *               description: "Daniel Wroughton Craig is an English actor."
 *     responses:
 *       200:
 *         description: Succeed.
 *       404:
 *         description: Not found.
 */
router.post('/', create);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   put:
 *     summary: Updating a member's information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The member ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      # Request body contents
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *               address:
 *                 type: array
 *               description:
 *                 type: string
 *             example:   # Sample object
 *               name: Jessica Smith
 *               dob: "1968-03-02"
 *               address: [121.458715, 31.221061]
 *               description: "Daniel Wroughton Craig is an English actor."
 *     responses:
 *       200:
 *         description: Succeed.
 *       404:
 *         description: Not found.
 */
router.put('/:id([0-9]+)', update);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   delete:
 *     summary: Remove a member
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The member ID
 *     responses:
 *       200:
 *         description: Succeed.
 */
router.delete('/:id([0-9]+)', destory);

export default router;
