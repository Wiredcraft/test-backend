const {sequelize, Op, BaseModel, DataTypes, Sequelize} = require('../BaseRepository')

/**
 * @mixes BaseModel
 */
class UserFollow extends BaseModel {

}

UserFollow.init({
    // 在这里定义模型属性
    userId: {type: DataTypes.INTEGER, comment: '用户id'},
    followId: {type: DataTypes.INTEGER, comment: '关注的用户id'},

}, {
    modelName: 'UserFollow',
    comment: '用户表',
    defaultScope: {},
    indexes: [
        {
            name: 'ids_follower',
            using: 'BTREE',
            fields: [
                {
                    attribute: 'userId',
                }
            ]
        },
        {
            name: 'ids_follow',
            using: 'BTREE',
            fields: [
                {
                    attribute: 'followId',
                }
            ]
        },
    ],
})


module.exports = UserFollow
// 在模型中定义多对多关联关系虽然会自动生产中间表，但是会产生外键，需要在配置中指定取消外键约束



