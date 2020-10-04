/**
 * @swagger
 * definitions:
 *   UserLink:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: user id, shall be a string of uuid v4, length limit 36
 *         example: "29256e52-9ca2-49d5-8b4e-f42578ccae68"
 *       link:
 *         type: array
 *         items:
 *           type: string
 *           description: user id
 *           example: "a3256e52-9ca2-49d5-8b4d-f42578ccae68"
 */

export interface UserLink {
  id: string;
  link: string[];
}
