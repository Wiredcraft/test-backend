const {sequelize, BaseModel} = require('./BaseRepository')

/**
 * 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
 * @param dbName  schema 名
 * @param tableNames
 * @param type  默认 1：表示更新创建所有的表。 如果不为 1，则仅创建 tablename 指定的表
 */
module.exports.createIfNotExists = async (dbName, tableNames = [], type = 1) => {
    if (type === 1) {

        if (dbName) {
            const models = require('require-all')({
                dirname: __dirname + '/model',
                filter: /.*\.js$/,
                resolve: function (Model) {
                    return Model
                },
                map: val => val.replace('.js', '')
            })

            for(let [fileName, model] of Object.entries(models)) {
                // model.schema('COMMUNITEE_GENERAL_DEFAULT').sync({force: false})
                await model.schema(dbName).sync({force: false})
            }
        } else  await sequelize.sync({force: false})

    } else {
        tableNames.forEach(tableName => {
            const model = require('./model/' + tableName)
            dbName ? model.schema(dbName).sync() : model.sync()
        })
    }
}
// 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配
module.exports.alterColumns = (tableNames = [], dbName) => {
    tableNames.forEach(tableName => {
        const model = require('./model/' + tableName)
        // Not recommended for production use.
        dbName ? model.schema(dbName).sync({ alter: true }) : model.sync({ alter: true })
    })
}