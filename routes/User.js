const BaseController = require('../orm/controller/BaseController')
const CONSTANT_MESSAGE = require('../constant_message')

/**
 * @override
 * 用户接口
 */
class User extends BaseController {

    /**
     * @override
     */
    registerRouter(parent) {
        // 此处可以注册 增删改查之外的其它接口 如: this.router.post('/apiname', (req, res)=>{// do something here})
    }

    /**
     * @override
     */
    async beforeCreate(req, res, ret, model) {
        // 用户查重
        await this.checkUserConflict(req)
    }

    /**
     * @override
     */
    async beforeUpdate(req, res, ret, model) {
    }


    // 用户查重
    async checkUserConflict(req) {
        if (!req.body.hasOwnProperty('name') && !req.body.hasOwnProperty('name')) throw new Error('请传 name 参数')
        const conflictingUser = await this.CurrentModel.findAll({
            where: {
                name: req.body.name,
            }
        })
        if (conflictingUser && conflictingUser.length > 0) {
            throw new Error('USERNAME_DUPLICATE')
        }
    }
}


module.exports = new User().getRouter()
