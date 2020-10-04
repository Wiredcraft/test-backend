/**
 * @swagger
 * definitions:
 *   UserGeo:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: user id, shall be a string of uuid v4, length limit 36
 *         example: "29256e52-9ca2-49d5-8b4e-f42578ccae68"
 *       longitude:
 *         type: string
 *         description: longitude of a point, to avoid precision issue using string type
 *         example: "121.492696"
 *       latitude:
 *         type: string
 *         description: latitude of a point, to avoid precision issue using string type
 *         example: "31.225500"
 */

export interface UserGeo {
  id: string;
  longitude: string;
  latitude: string;
}
