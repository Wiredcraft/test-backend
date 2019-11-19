import express = require('express')
const router = express.Router()
import userService from '../service/user.service'
// tslint:disable-next-line: max-line-length
import { ICreateUserParams, ICreateUserResponse, IRemoveUserParams, IUpdateUserParams } from '../types/api.users'
import loginService from '../service/login.service'

router.get('/', async (req, res) => {
  const doc = await userService.queryAll()
  res.status(200).send({
    doc,
  })
})

router.post('/create', async (req, res) => {
  const parmas = req.body as ICreateUserParams
  const user = await userService.cryptPwdAndCreateUser(parmas)

  res.status(200).send(user)
})

router.post('/remove', async (req, res) => {

  // 如果需要获取token中的内容，可以这么写
  // const token = String(req.headers.authorization)

  const parmas = req.body as IRemoveUserParams
  const users = await userService.deleteUser(parmas._id)
  res.status(200).send({
    users,
  })
})

router.post('/update', async (req, res) => {/*  */
  const parmas = req.body as IUpdateUserParams
  const users = await userService.updateUser(parmas._id, parmas)
  res.status(200).send({
    users,
  })
})

router.post('/following', async (req, res) => {
  const token = String(req.headers.authorization)
  const { userId } = await loginService.decryptToken(token)
  const parmas = req.body
  const result = await userService.following(userId, parmas.targetId)
  res.status(200).send(result)
})

router.get('/get/followers/count', async (req, res) => {
  const token = String(req.headers.authorization)
  const { userId } = await loginService.decryptToken(token)
  const followers = await userService.getFollowersCount(userId)
  res.status(200).send({ followers })
})

router.get('/get/following/count', async (req, res) => {
  const token = String(req.headers.authorization)
  const { userId } = await loginService.decryptToken(token)
  const following = await userService.getFollowingCount(userId)
  res.status(200).send({ following })
})

router.post('/unsubscribe', async (req, res) => {
  const token = String(req.headers.authorization)
  const { userId } = await loginService.decryptToken(token)
  const parmas = req.body
  const result = await userService.unsubscribe(userId, parmas.targetId)
  res.status(200).send(result)
})

router.get('/get/info', async (req, res) => {
  const token = String(req.headers.authorization)
  const { userId } = await loginService.decryptToken(token)
  const result = await userService.getInfo(userId)
  res.status(200).send(result)
})


export default router