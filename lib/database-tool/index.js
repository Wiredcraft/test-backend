const { MYSQL_CONFIG } = require('../../config')
const logger = require('../logger')
const Mysql = require('sync-mysql')
const Deploy = require('./deploy')

/**
 * 全部是同步方法
 */
module.exports = {

    MYSQL_CONFIG,
    Deploy,

    buildDatabaseNameBySuffix(suffix) {
        return MYSQL_CONFIG.dbPrefix + suffix
    },

    dbConnectOptions: {
        host: MYSQL_CONFIG.host,
        port: MYSQL_CONFIG.port,
        user: MYSQL_CONFIG.user,
        password: MYSQL_CONFIG.password,
    },

    createDBIfNotExists(DBName) {

        if (!DBName) throw new Error('请指定要创建的数据库名字!')



        let sql = 'CREATE DATABASE IF NOT EXISTS ' + DBName + ' DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;'
        const db = new Mysql(this.dbConnectOptions)
        const ret = db.query(sql)
        if (ret && ret.warningCount === 0) logger.warn(`系统成功已自动创建数据库 ${DBName}`)
    }
}