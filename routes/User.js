const BaseController = require('../orm/controller/BaseController')
const CONSTANT_MESSAGE = require('../constant_message')
const {QueryTypes} = require('sequelize')

/**
 * @override
 * 用户接口
 */
class User extends BaseController {

    /**
     * @typedef User_Full
     * @property {integer} id
     * @property {string} name
     * @property {string} dob - 出生日期
     * @property {string} address - 地址
     * @property {string} description - 描述
     * @property {string} lng - 经度
     * @property {string} lat - 纬度
     * @property {Array.<User>} follows - 关注的人
     * @property {Array.<User>} followers - 关注我的人
     */
    /**
     * @typedef User_Full_Distance
     * @property {integer} distance
     * @property {integer} id
     * @property {string} name
     * @property {string} dob - 出生日期
     * @property {string} address - 地址
     * @property {string} description - 描述
     * @property {string} lng - 经度
     * @property {string} lat - 纬度
     */

    /**
     * @typedef DataNode_List_UserFull
     * @property {Array.<User_Full>} list
     */
    /**
     * @typedef DataNode_List_UserFull_Distance
     * @property {Array.<User_Full_Distance>} list
     */

    /**
     * @typedef UserResponse
     * @property {integer} code - eg: 0, 1
     * @property {string} msg=success - eg: 'success'
     * @property {User_Full.model} data
     */
    /**
     * @typedef UserResponse_List
     * @property {integer} code - eg: 0, 1
     * @property {string} msg=success - eg: 'success'
     * @property {DataNode_List_UserFull.model} data
     */

    /**
     * @typedef UserResponse_Distance_List
     * @property {integer} code - eg: 0, 1
     * @property {string} msg=success - eg: 'success'
     * @property {DataNode_List_UserFull_Distance.model} data
     */

    /**
     * @override
     */
    registerRouter(parent) {
        // 此处可以注册 增删改查之外的其它接口 如: this.router.post('/apiname', (req, res)=>{// do something here})


        /**
         * 附带关注数据的用户列表
         * @route POST /user/relations/list
         * @summary 附带关注数据的用户列表
         * @group User[用户] - User表
         * @produces application/json application/xml
         * @consumes application/json application/xml
         * @param {列表请求-分页及筛选参数.model} 请求体.body.required - 分页及筛选参数
         * @returns {UserResponse_List.model} 200 - 符合条件的 User 列表
         * @security JWT
         */
        this.router.post('/relations/list', (req, res) => {
            return this.index(req, res, 'relation')
        })

        /**
         * 指定用户附近的用户
         * @route GET /user/neighbouring/{id}/{distance}
         * @summary 指定用户附近的用户(距离通过 path 传参指定)
         * @group User[用户] - User表
         * @param {integer} id.path.required - 用户 id
         * @param {integer} distance.path.required - 要查询的距离范围
         * @returns {UserResponse_Distance_List.model} 200 - 符合条件的 User 列表
         * @security JWT
         */
        this.router.get('/neighbouring/:id/:distance', async (req, res) => {
            const currentUser = await parent.CurrentModel.findByPk(req.params.id)
            if (!currentUser) return this.sendERROR(res, null, '没有找到当前用户')
            const ret = await parent.CurrentModel.sequelize.query('select ROUND(6378.138*2*ASIN(SQRT(POW(SIN(($lat*PI()/180-lat*PI()/180)/2),2)\n' +
                '+COS($lat*PI()/180)*COS(lat*PI()/180)*POW(SIN(($lng*PI()/180-lng*PI()/180)/2),2)))*1000) \n' +
                'AS distance, t.* FROM User t having distance <= $dstc order by distance asc',
                {
                    // logging: console.debug,
                    logging: false,
                    model: parent.CurrentModel.scope('relation'), // 需要映射的模型
                    mapToModel: true, // 如果你有任何映射字段,则在此处传递 true
                    // raw: true, // 如果你没有查询的模型定义,请将此项设置为true.
                    type: QueryTypes.SELECT,  // 指定sql为SELECT或其它
                    bind: {
                        lng: currentUser.lng,
                        lat: currentUser.lat,
                        dstc: req.params.distance
                    },
                    // nest: true, // 如果是嵌套对象，此项为 true，同时 sql 中包含这样格式的属性 foo.bar.baz
                }
            )
            return this.sendOK(res, { list: ret})
        })
    }

    /**
     * 用户-详情
     * @route GET /user/{id}
     * @summary 用户-详情(附带互相关注信息)
     * @group User[用户] - User表
     * @param {integer} id.path.required - 用户 id
     * @returns {UserResponse.model} 200 - 符合条件的 User 列表
     * @security JWT
     */
    async view(req, res, scope) {
        super.view(req, res, 'relation');
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
