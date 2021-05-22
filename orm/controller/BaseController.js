const CONSTANT_MESSAGE = require('../../constant_message')
const sqlQueryOrmBridge = require('../sqlQueryOrmBridge')
const {Repo, sequelize, BaseModel, Op} = require('../BaseRepository')
const Config = require('../../config')
const jwt = require('jsonwebtoken')
const logger = require('../../lib/logger')
////



/**
 * 路由控制器基类 - 子类需要实现抽象方法 {@link BaseController.registerRouter},并在 export 之前调用{@link BaseController.getRouter}以注册路由
 * @abstract
 */
class BaseController {
    express = require('express');
    router = this.express.Router();
    CONSTANT_MESSAGE = CONSTANT_MESSAGE
    sqlQueryOrmBridge = sqlQueryOrmBridge
    Repo = Repo
    sequelize = sequelize
    BaseModel = BaseModel
    Op = Op
    CurrentModel = BaseModel
    Config = Config
    jwt = jwt
    logger = logger
    scope

    constructor(scope) {
        if (scope) this.scope = scope
    }

    isArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    }

    toInt(i, defaul = 0) {
        if (i === null || i === "")
            return defaul
        if (isNaN(+i))
            return defaul
        return +i
    }

    toString(str, defaul = "") {
        if (typeof str === "string") {
            return str
        }
        return defaul
    }

    isValid(value) {
        return value !== undefined && value !== null
    }

    isNumberic(value) {
        return !isNaN(value) && (value + '').length > 0
    }

    isValidNumberic(value) {
        return isValid(value) && isNumberic(value)
    }

    requestBodyHasParamAndIsValid(req = {}, paramName = '') {
        if (paramName && req.body.hasOwnProperty(paramName)) {
            const value = req.body[paramName]
            return isValid(value)
        } else {
            return false
        }
    }

    requestBodyHasParamAndIsValidNumberic(req = {}, paramName = '') {
        return requestBodyHasParamAndIsValid(req, paramName) && isValidNumberic(req.body[paramName])
    }

    filterValidParamsInObject(obj) {
        const inValidKeys = Object.keys(obj).filter(key => !isValid(obj[key]))
        inValidKeys.forEach(key => {
            delete obj[key]
        })
    }

    filterValidParamsInRequestBody(req) {
        filterValidParamsInObject(req.body)
    }

    md5(str) {
        if (!str) return ''
        const crypto = require('crypto')
        var md5sum = crypto.createHash('md5')
        md5sum.update(str)
        str = md5sum.digest('hex')
        return str
    }

    randomPassword(length) {
        length = Number(length)
        // Limit length
        if (length < 6) {
            length = 6
        } else if (length > 16) {
            length = 16
        }
        let passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@#$%&*()'];
        var password = [];
        let n = 0;
        for (let i = 0; i < length; i++) {
            // If password length less than 9, all value random
            if (password.length < (length - 4)) {
                // Get random passwordArray index
                let arrayRandom = Math.floor(Math.random() * 4);
                // Get password array value
                let passwordItem = passwordArray[arrayRandom];
                // Get password array value random index
                // Get random real value
                let item = passwordItem[Math.floor(Math.random() * passwordItem.length)];
                password.push(item);
            } else {
                // If password large then 9, lastest 4 password will push in according to the random password index
                // Get the array values sequentially
                let newItem = passwordArray[n];
                let lastItem = newItem[Math.floor(Math.random() * newItem.length)];
                // Get array splice index
                let spliceIndex = Math.floor(Math.random() * password.length);
                password.splice(spliceIndex, 0, lastItem);
                n++
            }
        }
        return password.join("");
    }

    initRet(msg) {
        return {
            data: {},
            code: 0,
            message: msg,
            time: Date.now(),
        };
    }

    sendOK(res, data, msg) {
        res.send({code: 0, message: msg || CONSTANT_MESSAGE.RESULT.OK, data: data || {}})
    }

    sendERROR(res, data, msg) {
        res.send({code: 1, message: msg || CONSTANT_MESSAGE.RESULT.OPERATE_FAILED, data: data || {}})
    }

    sendForbidden(res, data, msg) {
        res.status(403).send('requesting was forbidden')
    }

    async funcIndex(req, res, model, relationShip, conditions, orders, listProcessor = (list) => list, scope) {

        const CI = 1

        const result = await sqlQueryOrmBridge.execIndex({CI}, req, model, relationShip, conditions, orders, scope)
        if (result.code !== 0) {
            return this.sendERROR(res, null, CONSTANT_MESSAGE.RESULT[result.msg] || CONSTANT_MESSAGE.RESULT[result.msg] || result.msg)
        }

        this.sendOK(res, {
            list: await listProcessor(result.data),
            params: {total: result.total, begin: req.body.begin, count: req.body.count}
        })
    }

    async funcView(req, res, model, scope) {
        let id = +req.body.id
        if (isNaN(id))
            return this.sendERROR(res, null, CONSTANT_MESSAGE.RESULT.ID_NULL)
        const row = scope ? await model.scope(scope).findByPk(id) : await model.findByPk(id)
        await this.afterView(req, res, row)
        this.sendOK(res, row)
    }

    funcDestroy(req, res, model, onSingleSuccess = (id, currentRow) => {
    }) {
        let ret = {code: 0, message: CONSTANT_MESSAGE.RESULT.OK, data: {}}
        let arr = req.body.ids
        let size = arr.length
        arr.forEach(async id => {
            const currentRow = this.scope ? await model.scope(this.scope).findByPk(id) : await model.findByPk(id)
            await this.beforeRowDelete(req, res, currentRow)
            const result = await model.destroy({where: {id: id}})
            ret.data[+id] = result
            if (result.code === 1) {
                ret.code = 1
                ret.message = CONSTANT_MESSAGE.RESULT.DELETE_FAILED
            }
            onSingleSuccess(id, currentRow)
            size--;
            if (size === 0) {
                res.send(ret)
            }
        })
    }

    async index(req, res, scope) {
        scope = scope || this.scope
        this.funcIndex(req, res, this.CurrentModel, [], undefined, [], async (list) => {
            return await this.processIndexList(list) || list
        }, scope)
    }

    async view(req, res, scope) {
        scope = scope || this.scope
        this.funcView(req, res, this.CurrentModel, scope)
    }

    async create(req, res, scope, autoReturn = true) {
        scope = scope || this.scope
        const ret = this.initRet(this.CONSTANT_MESSAGE.RESULT.ADMINISTRATOR_OK)

        await this.beforeCreate(req, res, ret, this.CurrentModel)

        // const user = await User.create({...req.body, UserRoles: [{RoleId: 1}] }, {include: [User.UserRole]}) // shuqian 级联创建/更新的另一种方式
        const entity = await this.CurrentModel.create(req.body)
        // 如果在 model 中定义了 CascadeManyToManyModel 则根据这个定义自动从请求体中取到子对象的值进行级联创建，否则需要实现更新回调方法手动进行级联创建
        if (this.CurrentModel.CascadeManyToManyModel) {
            for (const rm of this.CurrentModel.CascadeManyToManyModel) {
                if (req.body.hasOwnProperty(rm.as) && this.ifAllowCascade('create', rm)) {
                    await entity[rm.accessors.set](req.body[rm.as])
                }
            }
        }
        // 如果在 model 中定义了 CascadeModel 则根据这个定义自动从请求体中取到子对象的值进行级联创建，否则需要实现更新回调方法手动进行级联创建
        if (this.CurrentModel.CascadeModel) {
            for (const rm of this.CurrentModel.CascadeModel) {
                if (req.body.hasOwnProperty(rm.as) && this.ifAllowCascade('create', rm)) {
                    const valueNode = req.body[rm.as]
                    if (!(valueNode instanceof Array)) {
                        await entity[rm.accessors.create](valueNode)
                    } else {
                        for (const index in valueNode) {
                            await entity[rm.accessors.create](valueNode[index])
                        }
                    }
                }
            }
        }

        ret.data = scope ? await this.CurrentModel.scope(scope).findByPk(entity.id) : await this.CurrentModel.findByPk(entity.id)
        await this.afterCreated(req, res, ret, entity)
        if (autoReturn) res.send(ret)
        else return ret
    }

    async update(req, res, scope) {
        scope = scope || this.scope
        const ret = this.initRet(this.CONSTANT_MESSAGE.RESULT.ADMINISTRATOR_OK)
        const oldRow = scope ? await this.CurrentModel.scope(scope).findByPk(req.body.id) : await this.CurrentModel.findByPk(req.body.id)
        await this.beforeUpdate(req, res, ret, this.CurrentModel, oldRow)
        const operationRow = await this.CurrentModel.findByPk(req.body.id)

        if (req.body.Password) {
            req.body.Password = this.md5(req.body.Password)
        }

        // await this.CurrentModel.update(req.body, {where: {id: req.body.id}})
        Object.entries(req.body).forEach(([key, value]) => {
            operationRow[key] = value
        })
        await operationRow.save()

        let entity = await this.CurrentModel.findByPk(req.body.id)

        // 如果在 model CascadeManyToManyModel，否则需要实现更新回调方法手动进行级联更新
        if (this.CurrentModel.CascadeManyToManyModel) {
            for (const rm of this.CurrentModel.CascadeManyToManyModel) {
                if (req.body.hasOwnProperty(rm.as) && this.ifAllowCascade('update', rm)) {
                    await entity[rm.accessors.set](req.body[rm.as])
                }
            }
        }
        // 如果在 model 中定义了 CascadeModel 则根据这个定义自动从请求体中取到子对象的值进行级联创建，否则需要实现更新回调方法手动进行级联创建
        if (this.CurrentModel.CascadeModel) {
            for (const rm of this.CurrentModel.CascadeModel) {
                if (req.body.hasOwnProperty(rm.as) && this.ifAllowCascade('update', rm)) {

                    // 方式一 设置1:N关系表对应行的外键为 null，或者删除N:N中间表记录
                    await entity[rm.accessors.set]([])

                    // 方式二  直接删除N:N中间表及1:N关系表中的对应行。 暂未调试通过
                    // const RelateModel = require('../model/' + rm.target.tableName)
                    //
                    // if (!(entity[rm.as] instanceof Array)) {
                    //     await RelateModel.destroy({where: {[rm.foreignKey]: entity[rm.as].id}})
                    // } else {
                    //     for (const index in entity[rm.as]) {
                    //         await RelateModel.destroy({where: {[rm.foreignKey]: entity[rm.as][index].id}})
                    //     }
                    // }

                    // 插入新的关联数据
                    const valueNode = req.body[rm.as]
                    if (!(valueNode instanceof Array)) {
                        await entity[rm.accessors.create](valueNode)
                    } else {
                        for (const index in valueNode) {
                            await entity[rm.accessors.create](valueNode[index])
                        }
                    }
                }
            }
        }
        entity = scope ? await this.CurrentModel.scope(scope).findByPk(entity.id) : await this.CurrentModel.findByPk(entity.id)
        ret.data = entity
        await this.afterUpdated(req, res, ret, entity, oldRow)

        res.send(ret)

    }

    async destroy(req, res) {
        this.funcDestroy(req, res, this.CurrentModel, async (id, currentRow) => {
            // 如果在 model CascadeManyToManyModel，否则需要实现更新回调方法手动进行级联更新
            if (this.CurrentModel.CascadeManyToManyModel) {
                for (const rm of this.CurrentModel.CascadeManyToManyModel) {
                    if (!this.ifAllowCascade('destroy', rm)) continue
                    const RelateModel = require('../model/' + rm.combinedName)
                    RelateModel.destroy({where: {[rm.foreignKey]: id}})
                }
            }
            // 如果在 model 中定义了 CascadeModel 则根据这个定义自动从请求体中取到子对象的值进行级联删除，否则需要实现更新回调方法手动进行级联删除
            if (this.CurrentModel.CascadeModel) {
                for (const rm of this.CurrentModel.CascadeModel) {
                    if (!this.ifAllowCascade('destroy', rm)) continue
                    const RelateModel = require('../model/' + rm.target.tableName)
                    RelateModel.destroy({where: {[rm.foreignKey]: id}})
                }
            }
            this.onRowDeleted(req, res, id, currentRow)
        })
    }

    /**
     * 返回已注册到 router 的 router 实例
     * @param {BaseModel|string} [model] - 可以传入对应 model 或者 model 的名字（表名），如果不传则默认取当前类名
     * @return {Router | Router}
     */
    getRouter(model) {
        const currentClassName = this.__proto__.constructor.name
        if (!model) {
            const defaultModel = sequelize.models[currentClassName]
            if (!defaultModel) {
                throw new Error(`请确认 Model ${currentClassName} 已被定义`)
            } else {
                this.CurrentModel = defaultModel
            }
        } else if (typeof model === 'string') {
            this.CurrentModel = sequelize.models[model]
        } else if (model.__proto__.name === 'BaseModel') {
            this.CurrentModel = model
        } else {
            throw new Error('model 参数仅接受 BaseModel 的扩展类或者字符串格式的 表名/模型名称。 或者可以不传此参数')
        }

        // 注册子类中新增的接口
        this.registerRouter(this)

        {
            /**
             * 注册默认的增删改查接口，可在子类中覆盖并添加自定义 swagger 文档 TASK 可以在 model-scope 中通过自定义属性对 5 个接口进行一些限定（如关闭某个接口或者参数限定等）
             */
            this.router.get('/', async (req, res) => {
                await this.index(req, res)
            })
            this.router.get('/:id', async (req, res) => {
                req.body = {id: req.params.id}
                await this.view(req, res)
            })
            this.router.post('/', async (req, res) => {
                await this.create(req, res)
            })
            this.router.put('/', async (req, res) => {
                await this.update(req, res)
            })
            this.router.delete('/', async (req, res) => {
                await this.destroy(req, res)
            })
            /** 注册一些额外的辅助性接口 */

                // 如果模型有枚举字段,生成对应的枚举查询接口.  默认使用 list 包裹数据节点, 如果wrapperNodeName传空字符, 则直接用 data 包裹数据
            const enumClomns = Reflect.ownKeys(this.CurrentModel).filter(key => key.includes('Enum')).map(enumName => enumName.replace('Enum', ''))
            enumClomns.forEach(col => {
                this.router.post(`/enum/${col.toLowerCase()}`, async (req, res) => {
                    const wrapperNodeName = req.body.hasOwnProperty('wrapperNodeName') ? req.body.wrapperNodeName : 'list'
                    const enumList = this.CurrentModel.getEnumList(`${col}Enum`, this.CurrentModel)
                    this.sendOK(res, {...(wrapperNodeName ? {[wrapperNodeName]: enumList} : enumList)})
                })
            })
        }

        return this.router
    }

    /**
     * 获取项目中所有符合条件的 routers
     * @param {[string]} [exceptModels]
     * @param {string|RegExp} [exceptRegEX]
     * @return {Object[]}
     */
    static getAllSepecificRouters(exceptModels = [], exceptRegEX = '') {
        const models = BaseController.getAllSepecificModels()
        // 批量引入 routers，并存入数组供后续注册路由
        let Controllers = require('require-all')({
            dirname: __dirname + '/../../routes',
            filter: /.*\.js$/,
            resolve: function (Controller) {
                return Controller
            },
            map: val => val.replace('.js', '')
        })
        const Controllers2 = require('require-all')({
                dirname: __dirname + '/../../open-api',
                filter: /.*\.js$/,
                resolve: function (Controller) {
                    return Controller
                },
                map: val => 'open-api' + val.replace('.js', '')
            })
        Controllers = {...Controllers, ...Controllers2}
        return Object.entries(Controllers).map(([k, v]) => new Object({name: k, router: v}))
            .concat(models.filter(m => !Object.keys(Controllers).includes(m.name)).map(m => new Object({
                name: m.name,
                router: new BaseController().getRouter(m.name.replace('open-api/', ''))
            })))
    }

    /**
     * 批量激活所有 models 并获取项目中所有符合条件的 models
     * @param {[string]} exceptModels
     * @param {string|RegExp}exceptRegEX
     * @return {Object[]}
     */
    static getAllSepecificModels(exceptModels = [], exceptRegEX = '') {

        const Models = require('require-all')({
            dirname: __dirname + '/../model',
            filter: /.*\.js$/,
            resolve: function (Model) {
                return Model
            },
            map: val => val.replace('.js', '')
        })
        return Object.entries(Models).map(([k, v]) => new Object({name: k, model: v}))
    }


    /**
     * @abstract
     * @param {BaseController} parent
     */
    registerRouter(parent) {
    }

    /**
     * 创建前检查
     * @abstract
     * @param req
     * @param res
     * @param ret
     * @param {BaseModel | Model} model
     * @return {Promise<void>}
     */
    async beforeCreate(req, res, ret, model = BaseModel) {
    }

    /**
     * 创建后回调
     * @abstract
     * @param req
     * @param res
     * @param ret
     * @param modelInstance
     * @return {Promise<void>}
     */
    async afterCreated(req, res, ret, modelInstance) {
    }

    /**
     * 更新前检查
     * @abstract
     * @param req
     * @param res
     * @param ret
     * @param {BaseModel | Model} model
     * @param oldRow
     * @return {Promise<void>}
     */
    async beforeUpdate(req, res, ret, model = BaseModel, oldRow) {
    }

    /**
     * 更新回调
     * @abstract
     * @param req
     * @param res
     * @param ret
     * @param modelInstance
     * @param oldRow
     * @return {Promise<void>}
     */
    async afterUpdated(req, res, ret, modelInstance, oldRow) {
    }

    /**
     * view 接口返回前钩子
     * @abstract
     * @param req
     * @param res
     * @param row
     * @return {Promise<void>}
     */
    async afterView(req, res, row) {}

    /**
     * 删除一行记录前的钩子
     * @abstract
     * @param req
     * @param res
     * @param currentRow
     */
    async beforeRowDelete(req, res, currentRow) {}

    /**
     * 删除一行记录成功后的回调
     * @abstract
     * @param req
     * @param res
     * @param id
     * @param currentRow
     */
    async onRowDeleted(req, res, id, currentRow) {
    }

    /**
     * 判断当前关联 model 是否允许级联操作，检查relationModel的 options 中是否有：cascadeCreate cascadeUpdate cascadeUpdate
     * @param {string|'create'|'update'|'destroy'}scope
     * @param {BaseModel} relationModel
     * @requires scope rm
     * @return {boolean}
     */
    ifAllowCascade(scope, relationModel) {
        return !(relationModel.options.hasOwnProperty('cascadeExcludes') && relationModel.options.cascadeExcludes.includes(scope));
    }

    /**
     * 处理 index 接口查询结果列表后再返回客户端
     * @abstract
     * @param list
     */
    async processIndexList(list) {}



    isEmail(str){
        const reg = new RegExp(/^\S+@\S+\.\S{2,}$/)
        return !!reg.test(str)
    }

}

module.exports = BaseController

