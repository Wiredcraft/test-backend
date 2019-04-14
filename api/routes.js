/**
 * @swagger
 *
 * definitions:
 *   NewUser:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *       dob:
 *         type: string
 *         format: data
 *       address:
 *         type: string
 *       description:
 *         type: string
 *       createdAt:
 *        type: string
 *        format: data
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
 */
 

 /**
  * @swagger
  *
  * /:
  *   get:
  *     description: Check the API status
  *     produces:
  *       - text/plain
  *     responses:
  *       200:
  *         description: APi is up and running
  */
 app.get('/', (req, res) => res.send('Ok'))

/**
 * @swagger
 *
 * /users:
 *   get:
 *     description: Fetch a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: user to fetch
 *         description: UserId of the user to fetch in the data.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: user found
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 *       404:
*          description: user not found
 */
app.get('/users/:id', (req, res) => res.send({
  var userId = req.params.id;
}))

/**
 * @swagger
 *
 * /users:
 *   post:
 *     description: Creates a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           $ref: '#/definitions/User'
 */
 app.post('/users', (req, res) => {
  // Your implementation logic comes here ...
});
