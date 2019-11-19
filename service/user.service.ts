import { AppError, ErrorCode } from '../common/errors'
import { User } from '../model/entity/users.model'
import { ICreateUserParams, ICreateUserResponse, ISaveUserParams } from '../types/api.users'
import { ILoginParams } from '../types/api.login'
import loginService from './login.service'
const cryptoRandomString = require('crypto-random-string')
const crypto = require('crypto')
import _ = require('lodash')
class UserService {

    // 计算附近位置的用户 TODO
    public async getNearUsers(userId: string): Promise<any> {
        const user = await User.findOne({ _id: userId })
        const users = await User.aggregate.near({
            near: [user.loc[0], user.loc[1]],
            distanceField: "user.address", // required
            maxDistance: 1000,
        });

        return users
    }

    // 查询单个用户信息(包含订阅人信息)
    public async getInfo(userId: string): Promise<any> {
        const user = await User.findOne({ _id: userId }).populate({
            path: 'following',
            select: { name: 1, _id: 1, },
            // populate: { path: 'following' },
            match: { _id: { $ne: userId } }
        })
        return user
    }

    // 查询指定用户的订阅总数
    public async getFollowingCount(userId: string): Promise<number> {
        const user = await User.findOne({ _id: userId })
        return user.following.length
    }

    // 查询指定用户的粉丝总数
    public async getFollowersCount(userId: string): Promise<number> {
        const user = await User.findOne({ _id: userId })
        return user.followers.length
    }

    // 取消订阅
    public async unsubscribe(userId: string, targetId: string): Promise<boolean> {
        try {
            const user = await User.findOne({ _id: userId })
            const target = await User.findOne({ _id: targetId })

            let following_arr = user.following || []
            let followers_arr = target.followers || []
            if ((following_arr.includes(targetId) && followers_arr.includes(userId))) {

                await _.remove(following_arr, (n) => {
                    return n == targetId
                })
                _.remove(followers_arr, (n) => {
                    return n == userId
                })

                console.log(following_arr)
                console.log(followers_arr)
                await Promise.all([User.update({ _id: userId }, { following: following_arr }), User.update({ _id: targetId }, { followers: followers_arr })])
            }
            return true

        } catch (error) {
            return false
        }
    }

    // 订阅/追随 某个用户
    public async following(userId: string, targetId: string): Promise<boolean> {
        try {
            const user = await User.findOne({ _id: userId })
            const target = await User.findOne({ _id: targetId })

            let following_arr = user.following || []
            let followers_arr = target.followers || []
            if (!(following_arr.includes(targetId) && followers_arr.includes(userId))) {
                following_arr.push(targetId)
                followers_arr.push(userId)
                await Promise.all([User.update({ _id: userId }, { following: following_arr }), User.update({ _id: targetId }, { followers: followers_arr })])
            }
            return true

        } catch (error) {
            return false
        }
    }

    // 创建用户并且加密密码
    public async cryptPwdAndCreateUser(u: ICreateUserParams) {

        const { salt, hash } = await this.cryptPwd(u.password)
        const data: ISaveUserParams = {
            name: u.name, dob: u.dob, age: u.age, address: u.address, description: u.description, salt, hash
        }

        // 创建用户
        const result = await User.create(data)

        // 创建token
        const token = await loginService.generateToken(hash, result._id)

        const user = {
            name: result.name, dob: result.dob, age: result.age, address: result.address, description: result.description
        } as ICreateUserResponse


        return { user, token }
    }

    // 登录
    public async login(login: ILoginParams) {
        const user = await User.findOne({ name: login.name })
        if (user === null) {
            return {
                isExist: false,
                user
            }
        }

        const hash = await this.authPwd(user.salt, login.password)
        if (hash !== user.hash) {
            return {
                isExist: true,
                passwordIsNotTrue: true,
                user,
            }
        }

        // 创建token
        const token = await loginService.generateToken(hash, user._id)

        return { isExist: true, user, token }
    }

    // 加密密码生成
    public async cryptPwd(password: string) {
        const salt = cryptoRandomString({ length: 10, type: 'base64' })
        const hashPwd = crypto.createHmac('sha256', 'your config.secretKey')
            .update(password)
            .digest('hex')

        const hash = crypto.createHmac('sha256', 'your config.secretKey')
            .update(hashPwd + salt)
            .digest('hex')
        return {
            salt, hash
        }
    }

    // 密码验证
    public async authPwd(salt: string, password: string) {
        const hashPwd = crypto.createHmac('sha256', 'your config.secretKey')
            .update(password)
            .digest('hex')

        const hash = crypto.createHmac('sha256', 'your config.secretKey')
            .update(hashPwd + salt)
            .digest('hex')
        return hash
    }

    async queryAll() {
        return await User.find({})
    }

    async deleteUser(_id: string) {
        return await User.deleteOne({ _id })
    }

    async updateUser(_id: string, u) {
        try {
            return await User.update({ _id }, { u })
        } catch (error) {
            throw new AppError(ErrorCode.UpdateModelField)
        }
    }
}
const userService = new UserService()

export default userService
