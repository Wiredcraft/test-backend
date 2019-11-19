import express = require('express')
const router = express.Router()
import userService from '../service/user.service'
// tslint:disable-next-line: max-line-length
import { ILoginParams } from '../types/api.login'
router.post('/', async (req, res) => {
    const parmas = req.body as ILoginParams

    const result = await userService.login(parmas)
    res.status(200).send({
        result
    })
})

export default router