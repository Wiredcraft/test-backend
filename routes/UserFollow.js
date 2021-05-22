const BaseController = require('../orm/controller/BaseController')
const CONSTANT_MESSAGE = require('../constant_message')

/**
 * @override
 * 用户接口
 */
class UserFollow extends BaseController {

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
    }

    /**
     * @override
     */
    async beforeUpdate(req, res, ret, model) {
    }

}


module.exports = new UserFollow().getRouter()
