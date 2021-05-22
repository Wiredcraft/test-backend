const BaseController = require('../orm/controller/BaseController')
const CONSTANT_MESSAGE = require('../constant_message')
const {QueryTypes} = require('sequelize')

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
        this.router.post('/relations/list', (req, res) => {
            return this.index(req, res, 'relation')
        })

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
     * @override
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
