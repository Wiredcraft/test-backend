import { ITokenRes, IDecryptToken } from "../types/api.login"
import { Login } from "../model/entity/login.model"
import jwt = require('jsonwebtoken')
import config from "../constant"
class LoginService {

    // 生成token
    public async generateToken(hash: string, userId: string): Promise<ITokenRes> {

        // 删除所有原先的token——仅仅是删除数据表中的
        await Login.deleteMany({ _id: userId })

        // 提供jwt加密的obj
        const tokenObj = {
            hash,
            userId,
        }

        // 通过jwt获得两个不同的token
        /**
         * 1. accessToken: 授权两个小时的token，提供前端使用
         * 2. refreshToken: 授权60天，此token只用来更新accessToken，用来应对token过期的情况，具体可以查看refreshController
         * 3. token一旦生成，规定时间内无法销毁(即使删除数据库也无法销毁已存在的token)
         */
        const accessToken = jwt.sign(tokenObj, config.secretKey, {
            expiresIn: 60 * 60 * 24 * 1,
            algorithm: 'HS256'
        })
        // console.log('accessToken', accessToken)

        const refreshToken = jwt.sign(tokenObj, config.secretKey, {
            expiresIn: 60 * 60 * 24 * 60 // 两个月,
            , algorithm: 'HS256'
        })

        await this.saveRefreshToken(userId, refreshToken, accessToken)

        return {
            accessToken,
            refreshToken
        } as ITokenRes
    }

    // 把refreshToken保存到数据库中
    public async saveRefreshToken(userId: string, refreshToken: string, accessToken: string) {
        // 保存token
        const reresh = new Login({
            userId,
            accessToken,
            refreshToken
        })

        await reresh.save()
        // if (result) {
        //     console.log('-----refreshToken保存成功！----')
        // } else {
        //     console.log('-----refreshToken保存失败！----')
        // }
    }

    // 解密token
    public async decryptToken(token: string): Promise<IDecryptToken> {

        // 1. 拆分Bearer,获取token
        const tArr = token.split(' ')
        // console.log('-----拆开查看数据——----', tArr)
        // console.log('-----拆分Bearer后去到的token-----', tArr[1])

        // 2. 解密token
        const data = Object(jwt.verify(tArr[1], config.secretKey, { algorithms: ['HS256'] }))
        // console.log('accesstokn-----', data)

        // 3. 获取userId和openId
        const userId = data.userId
        const hash = data.hash

        return {
            userId,
            hash
        } as IDecryptToken
    }
}
const loginService = new LoginService()

export default loginService
