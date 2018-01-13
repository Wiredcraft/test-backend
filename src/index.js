const express = require('express')
const bodyParser = require('body-parser')

const config = require('./config')
const UserService = require('./services/user')
const Db = require('./db')

const db = new Db(config.db)
const userService = new UserService(db)
const userRouter = express.Router()
const app = express()
app.use(bodyParser.json())

/**
 * @api {get} /user/:id Read the data of a user
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} name          name of the user
 * @apiSuccess {String} dob           the users date of birth in the format YYYY-MM-DD 
 * @apiSuccess {String} address       the users address
 * @apiSuccess {String} description   a description of the user
 */
userRouter.get('/:id', (req, res) => {
  userService.get(req.params.id)
    .then((user) => {
      if (user) {
        res.json(user)
      } else {
        res.status(200).send('User not found')
      }
    }).catch(e => res.status(400).send(e.message))
})

/**
 * @api {post} /user Create a new user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} name          the name of the user
 * @apiParam {String} address       the users address
 * @apiParam {String} dob           the users date of birth in the format YYYY-MM-DD
 * @apiParam {String} description   the users description
 *
 * @apiSuccess {String} id          the id of the created user
 */
userRouter.post('/', (req, res) => {
  userService.create(req.body)
    .then(({ id }) => res.json({ id }))
    .catch(e => res.status(400).send(e.message))
})

/**
 * @api {delete} /user/:id Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {String} id the id of the user to delete
 */
userRouter.delete('/:id', (req, res) => {
  userService.delete(req.params.userId)
    .then(() => res.status(200).end())
    .catch((e) => res.status(400).send(e.message))
})

/**
 * @api {post} /user/:id Update an existing user
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {String} [name]          the name of the user
 * @apiParam {String} [address]       the users address
 * @apiParam {String} [dob]           the users date of birth in the format YYYY-MM-DD
 * @apiParam {String} [description]   the users description
 */
userRouter.post('/:id', (req, res) => {
  userService.update(req.params.id, req.body)
    .then(() => res.status(200).end())
    .catch(e => res.status(400).send(e.message))
})

app.use(`${config.prefix}/user`, userRouter)
db.on('ready', () => {
  app.listen(config.port, () => console.log(`Server listening on port ${config.port}`))
})
