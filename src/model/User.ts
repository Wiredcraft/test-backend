/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: user id, shall be a string of uuid v4, length limit 36
 *         example: "29256e52-9ca2-49d5-8b4e-f42578ccae68"
 *       name:
 *         type: string
 *         description: user name, length limit 32
 *         example: "Jonathan Dai"
 *       dob:
 *         type: integer
 *         format: int32
 *         description: date of birth of user, shall be a unix timestamp
 *         example: 472120968
 *       address:
 *         type: string
 *         description: user address, length limit 128
 *         example: "Some cool address in city"
 *       description:
 *         type: string
 *         description: user description, length limit 256
 *         example: "Some cool description of the user"
 *       createdAt:
 *         type: integer
 *         format: int32
 *         description: time user data created, shall be a unix timestamp
 *         example: 1579120968
 */

export interface User {
  id?: string;
  name: string;
  dob: number;
  address: string;
  description: string;
  createdAt: number;
}
