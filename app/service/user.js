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

    async checkExistence(filter) {
        const { ctx } = this;
        const count = await ctx.model.User.count(filter).exec();
        return count != 0;
    }

    async find({ pageNum = 1, pageSize = 10 }) {
        const { ctx } = this;
        const res = {};

        let users = []
        let count = 0
        let skip = ((Number(pageNum)) - 1) * Number(pageSize)

        users = await ctx.model.User.find({ valid: true }, 'basicInfo createAt').skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = await ctx.model.User.count({}).exec()

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

    async follow({ source, target }) {
        const { ctx } = this;
        const res = {};
        const sourceExisted = await this.checkExistence({ _id: source })
        if (!sourceExisted) {
            ctx.logger.warn("user.addFollower - user %s doesn't exist", source)
        }

        const targetExisted = await this.checkExistence({ _id: target })
        if (!targetExisted) {
            ctx.logger.warn("user.follow - user %s doesn't exist", source)
        }

        if (!sourceExisted || !targetExisted) {
            res.code = -1
            res.msg = "neither source nor target user doesn't exist"
            return res
        }

        const sourceActionRes = await ctx.model.User.findByIdAndUpdate(source, { $addToSet: { following: { user: target } } }, { new: true, select: "_id" });
        if (!sourceActionRes) {
            res.code = -2
            ctx.logger.warn("user.follow - %s follow %s failed", source, target)
            return res
        }

        const targetActionRes = await ctx.model.User.findByIdAndUpdate(target, { $addToSet: { followers: { user: source } } }, { new: true, select: "_id" });
        if (!targetActionRes) {
            res.code = -3
            ctx.logger.warn("user.follow - %s follow %s failed", source, target)
            return res
        }

        res.code = 1

        return res
    }

    async unfollow({ source, target }) {
        const { ctx } = this;
        const res = {};
        const sourceExisted = await this.checkExistence({ _id: source })
        if (!sourceExisted) {
            ctx.logger.warn("user.unfollow - user %s doesn't exist", source)
        }

        const targetExisted = await this.checkExistence({ _id: target })
        if (!targetExisted) {
            ctx.logger.warn("user.unfollow - user %s doesn't exist", source)
        }

        if (!sourceExisted || !targetExisted) {
            res.code = -1
            res.msg = "neither source nor target user doesn't exist"
            return res
        }

        const sourceActionRes = await ctx.model.User
            .findOneAndUpdate({ _id: source, following: { $elemMatch: { user: target, valid: true } } },
                { $set: { "following.$.valid": false } }, { new: true, select: "_id" })
        if (!sourceActionRes) {
            res.code = -2
            ctx.logger.warn("user.unfollow - %s follow %s failed", source, target)
            return res
        }

        const targetActionRes = await ctx.model.User
            .findOneAndUpdate({ _id: target, followers: { $elemMatch: { user: source, valid: true } } },
                { $set: { "followers.$.valid": false } }, { new: true, select: "_id" });
        if (!targetActionRes) {
            res.code = -3
            ctx.logger.warn("user.addFollower - %s follow %s failed", source, target)
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