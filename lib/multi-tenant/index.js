const nodeCache = require('../cache/index')
const databaseTool = require('../database-tool/index')
const logger = require('../logger')
const Crypto = require('../crypto/index')

module.exports = {
    async pullConfigToCache() {
        let list = [
            { id: 1, Name: '第一个测试协会', DatabaseSuffix: '1',
                Email: '289685629@qq.com', sk: '98f03512-7699-47b7-8ede-dee612150974',
                Domin: 'abc', Status: 1},
            { id: 2, Name: '第二个测试协会', DatabaseSuffix: '2',
                Email: '289685629@qq.com', sk: '98f03512-7699-47b7-8ede-dee612150975',
                Domin: 'ddd', Status: 0
            }
        ]
        // 调用配置服务接口,拉取所有租户的配置数据.如果接口访问失败或者返回的 list 是空,则返回测试数据
        const res = await Crypto.axiosRequest({
            url: `${databaseTool.MYSQL_CONFIG.config_center_host}/openapi/query/tenant/configs`,
            method: 'post',
            data: Crypto.encryptRequestObject({})
        })
        // fixme 拉取失败的处理
        if (res.status === 200 && res.data.code === 0) {
            list = res.data.data.tenantList
            // 将总配置数据(如 免费用户配置 订阅链接 注册链接等)放入缓存
            nodeCache.setCache(nodeCache.MAIN_CONFIG_KEY, res.data.data.main)
        }

        const map = {}
        list.forEach(row => {
            map[row.id] = row
        })
        return map
    },

    async refreshConfigCache() {
        const configMap = await this.pullConfigToCache()
        if (configMap && !configMap[0]) {
            configMap[0] = { id: 0, Name: '系统默认表', DatabaseSuffix: 'DEFAULT',
                Email: '289685629@qq.com', sk: '98f03512-7699-47b7-8ede-dee612150976',
                Domin: 'aaa', Status: 1}
        }
        // 将配置数据放入缓存
        nodeCache.setCache(nodeCache.MULTI_TENANT_CONFIG_CACHE_KEY, configMap)
        return configMap
    },

    /**
     * @return {Promise<void>} {id: {column1, column2...}}
     */
    async getConfig() {
        let config = nodeCache.getCache(nodeCache.MULTI_TENANT_CONFIG_CACHE_KEY)
        // 如果缓存里没有配置数据,则更新缓存(更新时会拉取最新数据)
        if (!config) {
            config = await this.refreshConfigCache()
        }
        return config
    },


    /**
     * 同步表结构
     * @return {Promise<void>}
     */
    async syncDatabaseStructureForTenant(dbName) {

        // 如不存在则创建表
        const SyncTableStructure = require('../../orm/SyncTableStructure')
        await SyncTableStructure.createIfNotExists(dbName)
        // 更新表结构
        await SyncTableStructure.alterColumns(databaseTool.MYSQL_CONFIG.tableToUpdateStucture, dbName)

    },

    /**
     * 放入预置数据,如果 seq 不行的话试试 sql命令导入 sql 文件
     * @return {Promise<void>}
     */
    async importDataToDatabaseForTenant(dbName) {
        const {QueryTypes} = require('sequelize')
        const {initSequelize} = require('../../orm/BaseRepository')
        const seq = initSequelize(dbName)
        const sqlQuery = databaseTool.Deploy.getInsertDataSql(dbName)
        for(let sql of sqlQuery.split(';')) {
            if (!sql) continue
            try {
                const ret = await seq.query(sql,
                    {
                        // logging: console.debug,
                        logging: false,
                        // model: Projects, // 需要映射的模型
                        // mapToModel: true, // 如果你有任何映射字段,则在此处传递 true
                        raw: true, // 如果你没有查询的模型定义,请将此项设置为true.
                        type: QueryTypes.INSERT,  // 指定sql为SELECT或其它
                        // bind: {
                        //     begin: begin,
                        //     end: end
                        // },
                        // nest: true, // 如果是嵌套对象，此项为 true，同时 sql 中包含这样格式的属性 foo.bar.baz
                    }
                )
            } catch (e) {
                if (e.message === 'Query was empty') logger.debug('预插入数据(如之前已经插入则忽略)执行完成')
                else if (e.name !== 'SequelizeUniqueConstraintError') logger.debug('预插入数据执行错误', e)
            }

        }

    },

    /**
     * 创建数据库\创建表\更新表字段定义
     * @return {Promise<void>}
     */
    async initDatabaseForTenant(configRow, dbNameSpecific) {
        // 如果对应的租户数据库不存在则创建
        if (dbNameSpecific || (configRow && configRow.DatabaseSuffix))
        {
            // 创建数据库
            const dbName = dbNameSpecific || databaseTool.buildDatabaseNameBySuffix(configRow.DatabaseSuffix)
            logger.debug(`============================  开始对数据库 ${dbName} 进行预处理  ============================`)
            databaseTool.createDBIfNotExists(dbName)
            // 同步数据库表结构及字段定义
            await this.syncDatabaseStructureForTenant(dbName)
            // 导入预置数据
            await this.importDataToDatabaseForTenant(dbName)
            logger.debug(`============================     数据库 ${dbName} 预处理结束    ============================`)
        }
        else throw new Error(`没有找到该租户的数据库后缀配置,所以无法创建他的数据库: ${JSON.stringify(configRow)}`)

    },
    /**
     * 创建数据库\创建表\更新表字段定义
     * @return {Promise<void>}
     */
    async initDatabasesForTenants() {
        const config = await this.getConfig()
        for(let [ id, row ] of Object.entries(config)) {
            await this.initDatabaseForTenant(row)
        }

    },

    /**
     * 获取当前登录租户对应的数据库名 (先找 url 参数,没找到的话根据域名对应)
     * @return {Promise<void>}
     */
    async getCurrentTenantDBName (req, app) {
        let dbName
        // 如果是多租户模式则从缓存中读取
        if (databaseTool.MYSQL_CONFIG.multi_tenant_mode)
        {
            const configTest =  await this.checkCurrentTenant(req, app)
            dbName = databaseTool.buildDatabaseNameBySuffix(configTest.DatabaseSuffix)
            nodeCache.setCache(nodeCache.CURRENT_TENANT_SCHEMA_KEY, dbName)
            console.log('当前 db 名称缓存已设置')
            return [dbName, configTest]
        }
        else {
            dbName = databaseTool.MYSQL_CONFIG.database
            nodeCache.setCache(nodeCache.CURRENT_TENANT_SCHEMA_KEY, dbName)
            return [dbName]
        }

        // 如果最终没有匹配到 schema 则报错

    },

    async checkCurrentTenant (req, app) {
        if (!databaseTool.MYSQL_CONFIG.multi_tenant_mode)
            return true
        // 如果是多租户模式则从缓存中读取配置,判断当前租户是否可以使用服务,否的话抛出异常
        const caches = nodeCache.getCache(nodeCache.MULTI_TENANT_CONFIG_CACHE_KEY)
        if (!caches) {
            const ErrorInterceptor = require('../../request-filter/ErrorInterceptor')
            ErrorInterceptor(app)
            this.refreshConfigCache()
            throw  new Error('没有找到对应的协会配置缓存,请稍后再试,或联系管理员')
        }
        const targetConfig = Object.values(caches).find(config => req.tenant.Domin.includes(config.Domin)) || Object.values(caches).find(config => +config.id === +req.tenant.id)
        if (!targetConfig) {
            const ErrorInterceptor = require('../../request-filter/ErrorInterceptor')
            ErrorInterceptor(app)
            this.refreshConfigCache()
            throw  new Error('没有找到对应的协会配置缓存,请稍后再试,或联系管理员')
        }

        // 根据租户当前的状态\订阅状态\免费用户状态等决定租户的使用受限策略
        await this.verifyTenantStatus(targetConfig)

        nodeCache.setCache(nodeCache.CURRENT_TENANT_CONFIG_KEY, targetConfig)
        return targetConfig

    },

    /**
     * 根据租户当前的状态决定租户的使用受限策略
     * @param targetConfig
     * @return {Promise<void>}
     */
    async verifyTenantStatus(targetConfig) {
        if (targetConfig.Status !== 1) {
            const ErrorInterceptor = require('../../request-filter/ErrorInterceptor')
            ErrorInterceptor(app)
            throw  new Error('这个协会当前服务不可用,如有疑问,请联系管理员')
        }
        return true

    },

    /**
     * 根据租户当前的订阅状态\免费用户状态等决定租户的使用受限策略
     * @param targetConfig
     * @return {Promise<boolean>}
     */
    async verifyTenantSubscriptionStatus(targetConfig) {
        if (targetConfig.Status !== 1) {
            const ErrorInterceptor = require('../../request-filter/ErrorInterceptor')
            ErrorInterceptor(app)
            throw  new Error('这个协会当前服务不可用,如有疑问,请联系管理员')
        }
        if (targetConfig.IsFree === 1) return true

        if (targetConfig.SubscriptionStatus < 1) {
            const ErrorInterceptor = require('../../request-filter/ErrorInterceptor')
            ErrorInterceptor(app)
            throw  new Error('这个协会未订阅服务,当前服务不可用,如有疑问,请联系管理员')
        }

    },


    /**
     * 向租户服务端发送事件
     * @param {string} event - e.g, "tenant_config_updated"
     * @param data
     * @return {Promise<{data: *, status: *}>}
     */
    async sendEvent2TenantServer(event, data =  {}) {
        const res = await Crypto.axiosRequest(
            {
                url: `${databaseTool.MYSQL_CONFIG.tenant_server_host}/openapi/webhook/system`,
                method: 'post',
                data: Crypto.encryptRequestObject({ event, data })
            }
        )
        // fixme 发送钩子失败的处理(斐波那契数列循环请求,仍然失败则记录到日志并发送邮件通知管理员)
        return res
    },
}