'use strict';
const Service = require('egg').Service;

class UserService extends Service {
    constructor(ctx) {
        super(ctx);
    }

    async create({ basicInfo }) {
        const { ctx } = this;
        const res = {};

        const userObj = { basicInfo }
        const result = await ctx.model.User.create(userObj);

        res.data = { id: result._id, createdAt: result.createdAt }
        res.code = 1

        return res
    }

    async find({ pageNum = 1, pageSize = 10 }) {
        const { ctx } = this;
        const res = {};

        let users = []
        let count = 0
        let skip = ((Number(pageNum)) - 1) * Number(pageSize)

        users = await ctx.model.User.find({ valid: true }, 'basicInfo createdAt').skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = await ctx.model.User.countDocuments({}).exec()

        res.code = 1
        res.data = { users, count }

        return res
    }

    async findById({ id }) {
        const { ctx } = this;
        const res = {};
        const result = await ctx.model.User.findById(id);
        if (result) {
            res.data = result;
            res.code = 1;
        } else {
            res.data = result;
            res.code = -1;
        }
        return res;
    }

    async follow({ sourceId, targetId }) {
        const { ctx } = this;
        const res = {};
        const sourceUser = await ctx.model.User.findById(sourceId);
        if (!sourceUser) {
            ctx.logger.warn("user.addFollower - user %s doesn't exist", sourceId)
        }

        const targetUser = await ctx.model.User.findById(targetId);
        if (!targetUser) {
            ctx.logger.warn("user.follow - user %s doesn't exist", targetId)
        }

        if (!sourceUser || !targetUser) {
            res.code = -1
            res.msg = "neither source nor target user doesn't exist"
            return res
        }

        const sourceActionRes = await ctx.model.User.findByIdAndUpdate(sourceId, { $addToSet: { following: { userId: targetId, userName: targetUser.basicInfo.name } } }, { new: true, select: "_id" });
        if (!sourceActionRes) {
            res.code = -2
            ctx.logger.warn("user.follow - %s follow %s failed", sourceId, targetId)
            return res
        }

        const targetActionRes = await ctx.model.User.findByIdAndUpdate(targetId, { $addToSet: { followers: { userId: sourceId, userName: sourceUser.basicInfo.name } } }, { new: true, select: "_id" });
        if (!targetActionRes) {
            res.code = -3
            ctx.logger.warn("user.follow - %s follow %s failed", sourceId, targetId)
            return res
        }

        res.code = 1

        return res
    }

    async unfollow({ sourceId, targetId }) {
        const { ctx } = this;
        const res = {};
        const sourceExisted = await this.checkExistence({ _id: sourceId })
        if (!sourceExisted) {
            ctx.logger.warn("user.unfollow - user %s doesn't exist", sourceId)
        }

        const targetExisted = await this.checkExistence({ _id: targetId })
        if (!targetExisted) {
            ctx.logger.warn("user.unfollow - user %s doesn't exist", sourceId)
        }

        if (!sourceExisted || !targetExisted) {
            res.code = -1
            res.msg = "neither source nor target user doesn't exist"
            return res
        }

        const sourceActionRes = await ctx.model.User
            .findOneAndUpdate({ _id: sourceId, following: { $elemMatch: { userId: targetId, valid: true } } },
                { $set: { "following.$.valid": false } }, { new: true, select: "_id" })
        if (!sourceActionRes) {
            res.code = -2
            ctx.logger.warn("user.unfollow - %s follow %s failed", sourceId, targetId)
            return res
        }

        const targetActionRes = await ctx.model.User
            .findOneAndUpdate({ _id: targetId, followers: { $elemMatch: { userId: sourceId, valid: true } } },
                { $set: { "followers.$.valid": false } }, { new: true, select: "_id" });
        if (!targetActionRes) {
            res.code = -3
            ctx.logger.warn("user.addFollower - %s follow %s failed", sourceId, targetId)
            return res
        }

        res.code = 1

        return res
    }

    async updateById({ id, basicInfo }) {
        const { ctx } = this;
        const res = {};
        const userObj = { basicInfo }
        const result = await ctx.model.User.findByIdAndUpdate(id, userObj, { new: true });
        res.code = result != null ? 1 : -1;
        if (res.code == -1) {
            ctx.logger.warn("user.updateById - user %s doesn't exist", id)
            res.msg = `user ${id} doesn't exist`
        }

        res.data = result;
        return res;
    }

    async markAsInvalid({ id }) {
        const { ctx } = this;
        const res = {};
        const userObj = { valid: false }
        const result = await ctx.model.User.findByIdAndUpdate(id, userObj, { select: ["valid"], new: true });
        res.code = result != null ? 1 : -1;
        if (res.code == -1) {
            ctx.logger.warn("user.markAsInvalid - user %s doesn't exist", id)
            res.msg = `user ${id} doesn't exist`
        }
        res.data = result;
        return res;
    }
}

module.exports = UserService;