const multi = require('./lib/multi-tenant/index')
const databaseTool = require('./lib/database-tool/index')
module.exports = {
    async prepare() {

        // 创建默认数据库(如没有创建的话)
        // - 创建表\更新表字段定义\导入预置数据(如必要)
        await multi.initDatabaseForTenant(null, databaseTool.MYSQL_CONFIG.database)

        return true
    }
}