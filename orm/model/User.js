const {sequelize, Op, BaseModel, DataTypes, Sequelize} = require('../BaseRepository')

/**
 * @mixes BaseModel
 */
class User extends BaseModel {
    static async auth(userName, password) {
        return await User.findOne({
            where: {
                UserName: userName,
                Password: password
            }
        })
    }

    getFullname() {
        // 本代码测试项目中没有将姓名分开,所以此处返回 name
        return this.FirstName ? `${this.FirstName} ${this.LastName}` : this.name
    }
}

User.init({
    // 在这里定义模型属性
    name: {type: DataTypes.STRING, comment: '用户名', unique: 'uk_user_name'},
    dob: {type: DataTypes.DATE, comment: '出生日期'},
    address: {type: DataTypes.STRING, comment: '地址'},
    description: {type: DataTypes.STRING, comment: '描述'},
    lng: {type: DataTypes.DECIMAL(9, 6), comment: '经度'},
    lat: {type: DataTypes.DECIMAL(9, 6), comment: '纬度'},
    // createdAt 由 baseModel 自动创建

    FullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.getFullname()
        }
    },



}, {
    modelName: 'User',
    comment: '用户表',
    defaultScope: {},
    scopes: {
        relation: {
            include: [ 'follows', 'followers'],
        },

    },
    indexes: [
        // // 在 email 上创建唯一索引
        // {
        //     unique: true,
        //     fields: ['email']
        // },
        //
        // 具有 order 字段的 BTREE 索引
        {
            name: 'ids_name',
            using: 'BTREE',
            fields: [
                {
                    attribute: 'name',
                    // order: 'ASC',
                    length: 10
                }
            ]
        },
    ],
    hooks: {
        afterCreate(instance, options) {
            // 钩子中的 this是模型类, instance 入参是实例,可以访问类的实例方法

            // 通知租户后端: 租户配置被更新
            const multi = require('../../lib/multi-tenant/index')
            setTimeout(()=>{
                multi.sendEvent2TenantServer('tenant_created', {id: instance.id})
            }, 5 * 1000)
        },
        afterUpdate(instance, options) {

        }
    },
})


module.exports = User
// 在模型中定义多对多关联关系虽然会自动生产中间表，但是会产生外键，需要在配置中指定取消外键约束

const UserFollow = require('./UserFollow')
User.CascadeManyToManyModel = [
    User.belongsToMany(User, {as: 'follows', through: UserFollow, foreignKeyConstraint: false,
        constraints: false, foreignKey: 'userId', sourceKey: 'id', targetKey: 'id' }),
    User.belongsToMany(User, {as: 'followers', through: UserFollow, foreignKeyConstraint: false,
        constraints: false, foreignKey: 'followId', sourceKey: 'id', targetKey: 'id' }),
]

User.CascadeModel = [
    // User.hasOne(DataLabel, {as: 'UserLevelValue', foreignKey:'id', sourceKey: 'UserLevel', constraints: false}),
]

