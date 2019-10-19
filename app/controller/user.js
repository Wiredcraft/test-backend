'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    constructor(ctx) {
        super(ctx);

        this.createRule = {
            name: 'string',
            dob: 'date',
            address: 'string',
            description: 'string',
        };
    }

    async show() {
        const { ctx } = this;

        ctx.validate({ id: { type: 'string' } }, ctx.params);

        try {
            let res = await ctx.service.user.findById({ id: ctx.params.id });
            ctx.helper.success({ ctx, res })
        } catch (err) {
            ctx.helper.error({ ctx, err })
        }
    }

    async index() {
        const { ctx } = this;

        ctx.validate({
            pageNum: { type: 'string', format: /\d+/, required: true },
            pageSize: { type: 'string', format: /\d+/, required: true },
        }, ctx.query);

        let pageParams = { pageNum: Number(ctx.query.pageNum), pageSize: Number(ctx.query.pageSize) }
        ctx.validate({
            pageNum: { type: 'int', min: 1 },
            pageSize: { type: 'int', min: 10, max: 100 },
        }, pageParams);

        try {
            let res = await ctx.service.user.find({ pageNum: ctx.query.pageNum, pageSize: ctx.pageSize });
            ctx.helper.success({ ctx, res })
        } catch (err) {
            ctx.helper.error({ ctx, err })
        }
    }

    async create() {
        const { ctx } = this;
        ctx.validate(this.createRule);

        try {
            let res = await ctx.service.user.create({ basicInfo: ctx.request.body });
            ctx.helper.success({ ctx, res })
        } catch (err) {
            ctx.helper.error({ ctx, err })
        }
    }

    async update() {
        const { ctx } = this;
        ctx.validate({ id: { type: 'string' } }, ctx.params);
        ctx.validate(this.createRule);

        try {
            let res = await ctx.service.user.updateById({ id: ctx.params.id, basicInfo: ctx.request.body });
            ctx.helper.success({ ctx, res })
        } catch (err) {
            ctx.helper.error({ ctx, err })
        };
    }

    async destroy() {
        const { ctx } = this;
        ctx.validate({ id: { type: 'string' } }, ctx.params);

        try {
            let res = await ctx.service.user.markAsInvalid({ id: ctx.params.id });
            ctx.helper.success({ ctx, res })
        } catch (err) {
            ctx.helper.error({ ctx, err })
        };
    }
}

module.exports = UserController;
