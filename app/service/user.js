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

    async updateById({ id, basicInfo }) {
        const { ctx } = this;
        const res = {};
        const userObj = { basicInfo }
        const result = await ctx.model.User.findByIdAndUpdate(id, userObj, { new: true });
        res.code = 1;
        res.data = result;
        return res;
    }

    async markAsInvalid({ id }) {
        const { ctx } = this;
        const res = {};
        const userObj = { valid: false }
        const result = await ctx.model.User.findByIdAndUpdate(id, userObj, { select: ["valid"], new: true });
        res.code = 1;
        res.data = result;
        return res;
    }
}

module.exports = UserService;