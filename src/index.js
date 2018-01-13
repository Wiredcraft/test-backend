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

userRouter.get('/:userId', (req, res) => {
  userService.get(req.params.userId)
    .then((user) => {
      if (user) {
        res.json(user)
      } else {
        res.status(200).send('User not found')
      }
    }).catch(e => res.status(400).send(e.message))
})

userRouter.post('/', (req, res) => {
  userService.create(req.body)
    .then(({ id: userId }) => res.json({ userId }))
    .catch(e => res.status(400).send(e.message))
})

userRouter.delete('/:userId', (req, res) => {
  userService.delete(req.params.userId)
    .then(() => res.status(200).end())
    .catch((e) => res.status(400).send(e.message))
})

userRouter.post('/:userId', (req, res) => {
  userService.update(req.params.userId, req.body)
    .then(() => res.status(200).end())
    .catch(e => res.status(400).send(e.message))
})

app.use(`${config.prefix}/user`, userRouter)
db.on('ready', () => {
  app.listen(config.port, () => console.log(`Server listening on port ${config.port}`))
})
