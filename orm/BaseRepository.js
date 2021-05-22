const {Sequelize, Op, Model, DataTypes} = require('sequelize');
const {MYSQL_CONFIG} = require("../config")
const logger = require('../lib/logger')
const nodeCache = require('../lib/cache/index')

console.log('导入 BaseModel')
// 初始化数据库连接: 分别传递参数 (其它数据库)
const initSequelize = (dbName) => {
    const currentSchema = nodeCache.getCache(nodeCache.CURRENT_TENANT_SCHEMA_KEY)
    currentSchema && console.log('获取新的 sequelize, 当前缓存 db 名称是 ' + currentSchema)
    const seq = new Sequelize(
        dbName || currentSchema || '',
        // MYSQL_CONFIG.database,
        MYSQL_CONFIG.user,
        MYSQL_CONFIG.password,
        {
            define: {paranoid: true},
            timezone: '+08:00',
            host: MYSQL_CONFIG.host,
            port: MYSQL_CONFIG.port,
            dialect: 'mysql',

            logging: msg => logger.debug(msg),
        })
    if(!currentSchema) seq.dialect.supports.schemas = true
    return seq
}
const sequelize = initSequelize()

class BaseRepository {

    /** 如果想新建实例，不要 new，使用 build({column: value, ...}) API */
    model = Model;

    sqlz = sequelize

    constructor(moduleName, options) {
        const {tableName, params} = require(`../mysql_tool/${moduleName}.cfg`)
        let columns = this.formatColumns(params)
        this.model = sequelize.define(tableName, {
            // Id: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false,
            //     field: 'id'
            // },
            ...columns,

            RecordState: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            // 不把 sequelize 自带的两个时间戳映射到这 2 个字段，因为本系统中时间使用的是 localtime，而 sequelize 使用的是零时区时间戳
            // Creation: DataTypes.DATE,
            // LastModified: DataTypes.DATE,

            // 在这里定义模型属性
            // lastName: DataTypes.STRING,

        }, {
            freezeTableName: true,
            // tableName: '',
            // 不把 sequelize 自带的两个时间戳映射到这 2 个字段，因为本系统中时间使用的是 localtime，而 sequelize 使用的是零时区时间戳
            timestamps: true,
            // 不想要 createdAt可以设为 false
            createdAt: 'Creation',

            // 想要 updatedAt 但是希望名称叫做 updateTimestamp
            updatedAt: 'LastModified',

            ...options,
        });
    }

    formatColumns(params) {
        let colMap = {}
        params.forEach(col => {

            colMap[col.name] = {...col, type: this.formatDataType(col.type)}

            if (colMap[col.name].hasOwnProperty('default')) {
                colMap[col.name].defaultValue = col.default
            }

            if (colMap[col.name].hasOwnProperty('comment')) {
                colMap[col.name].comment = col.comment
            }
        })
        return colMap;
    }

    formatDataType(type) {
        const regex = /\((.+?)\)/g
        let macthContent = type.match(regex)

        let colScaleRaw = 0
        if (macthContent && macthContent.length) {
            colScaleRaw = macthContent[0]
        }

        let colScale = colScaleRaw ? colScaleRaw.replace('(', '').replace(')', '').split(',') : null
        let colDataType = type.replace(colScaleRaw, '').toUpperCase()

        if (colDataType.indexOf('VARCHAR') > -1) {
            colDataType = 'STRING'
        }
        if (colDataType.indexOf('INT') > -1 && colDataType.indexOf('BIGINT') < 0) {
            colDataType = 'INTEGER'
        }
        if (colDataType.indexOf('BIGINT') > -1) {
            colDataType = 'BIGINT'
        }

        return (colScale && colScale.length) ?
            (colScale.length === 1 ? DataTypes[colDataType](colScale[0]) :
                    DataTypes[colDataType](colScale[0], colScale[1])
            ) :
            DataTypes[colDataType]
    }
}

module.exports.Repo = BaseRepository
module.exports.sequelize = sequelize
module.exports.initSequelize = initSequelize
module.exports.Op = Op
module.exports.Sequelize = Sequelize
/**
 * sequelize 数据库模型基类
 * @mixin
 * @type {BaseModel|Model}
 */
class BaseModel extends Model {
    /**
     * 定义 model 时的选项，可以覆盖默认选项
     * @param {Object} [options={sequelize,modelName:'User',freezeTableName:true,timestamps:true,createdAt:'Creation',updatedAt:'LastModified',paranoid:true}]
     * @param {Sequelize} [options.sequelize = sequelize] - sequelize 连接实例
     * @param {string} options.modelName - 模型&表名称
     * @param {boolean} [options.freezeTableName = true] - 是否强制模型名称等于表名
     * @param {boolean} [options.timestamps = true] - 当记录被创建或更新时，是否启用时间戳字段进行记录
     * @param {string} [options.createdAt = 'Creation'] - createdAt 的映射字段
     * @param {string} [options.updatedAt = 'LastModified] - updatedAt 的映射字段
     * @param {boolean} [options.paranoid = true] - 使用 sequelize 的偏执表功能以实现逻辑删除
     */
    static getOptions(options = {}) {
        const defaultOptions = {
            sequelize,
            freezeTableName: true,
            // tableName: '',
            timestamps: true,
            createdAt: 'createdAt', // 不想要 createdAt可以设为 false
            updatedAt: 'updatedAt', // 想要 updatedAt 但是希望名称叫做 updateTimestamp
            paranoid: true // 逻辑删除
        }
        return {...defaultOptions, ...options}
    }

    /**
     * @override
     */
    static init(attributes, options) {
        super.init(attributes, this.getOptions(options))
    }
}

/**
 * 需要级联操作的 多-多 模型列表
 * @type {[BaseModel]}
 */
BaseModel.CascadeManyToManyModel = []
/**
 * 需要级联操作的 一 - 一 或者 一 - 多 模型列表
 * 警告： 只能在父表模型中声明，不可在子表（持有引用外键的一方）声明，否则可能会删除主表记录
 * @type {[BaseModel]}
 */
BaseModel.CascadeModel = []

BaseModel.getEnumList = (name, model) => model && name && model[name] && Object.entries(model[name]).map(([value, name]) => new Object({value: isNaN(value) ? value : +value, name: isNaN(name) ? name : +name }))
/**
 * @type {BaseModel|Model}
 */
module.exports.BaseModel = BaseModel
module.exports.DataTypes = DataTypes
module.exports.Model = Model


