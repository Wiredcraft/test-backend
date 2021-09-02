'use strict'
const User = require('../model/user')
const Follow = require('../model/follow')

class UserContoller {
    /**
     * get
     */
    async get (ctx) {
        const userId = ctx.userId
        const user = await User.getUserById(userId)
        ctx.body = { info: user }
    }

    async create (ctx) {
        const { name, dob, address, description } = ctx.request.body
        const user = new User(name, dob, address, description)
        await user.create()
        ctx.body = { ok: true }
    }

    async update (ctx) {
        const userId = ctx.userId
        let user = await User.getUserById(userId)
        const { name = user.name, dob = user.dob, address = user.address, description = user.description } = ctx.request.body
        user = Object.assign(user, { name, dob, address, description })
        await new User(user).modify()
        ctx.body = { ok: true }
    }

    async delete (ctx) {
        const userId = ctx.userId
        let user = await User.getUserById(userId)
        await new User(user).remove()
        ctx.body = { ok: true }
    }

    async followingUsers (ctx) {
        const userId = ctx.userId
        const uids = await Follow.getFollowingUids(userId)
        ctx.body = { followers: uids }
    }

    async friends (ctx) {
        const userId = ctx.userId
        const uids = await Follow.getFriends(userId)
        ctx.body = { friends: uids }
    }

    async follow (ctx) {
        const userId = ctx.userId
        const { follower } = ctx.request.body
        await new Follow(userId, follower).follow()
        ctx.body = { ok: true }
    }

    async unfollow (ctx) {
        const userId = ctx.userId
        const { follower } = ctx.request.body
        await new Follow(userId, follower).unfollow()
        ctx.body = { ok: true }
    }
}

module.exports = new UserContoller()