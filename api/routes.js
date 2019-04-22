// Sets up the routes.
module.exports.setup = function(app) {
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
   app.get('/', (req, res) => {
     res.send('Ok');
   });

   /**
    * @swagger
    *
    * /users:
    *   post:
    *     description: Update a user with the given data
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
    *       400:
    *         description: Bad request, The payload is incorrect
    *       404:
    *         description: user not found
    */
    app.post('/users', (req, res) => {
      // Create a new user
     res.send('Ok');
   });

  /**
   * @swagger
   *
   * /users:
   *   get:
   *     description: Fetch a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: userId
   *         description: UserId of the user to fetch.
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
  app.get('/users/:id', (req, res) => {
    var userId = req.params.id;
    res.send('Ok');
  })

  /**
   * @swagger
   *
   * /users:
   *   put:
   *     description: Update a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: userId
   *         description: UserId of the user to update.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: updated user
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   *       400:
   *         description: Bad request, The payload is incorrect
   *       404:
   *          description: user not found
   */
   app.put('/users/:id', (req, res) => {
     // Update a User
    res.send('Ok');
  });

  /**
   * @swagger
   *
   * /users:
   *   delete:
   *     description: Delete a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: user to delete
   *         description: UserId of the user to delete.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: user deleted
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   *       404:
   *          description: user not found
   */
   app.delete('/users/:id', (req, res) => {
     // Delete a User
    res.send('Ok');
  });

};
